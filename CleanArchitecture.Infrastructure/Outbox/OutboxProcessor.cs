using System.Text.Json;
using CleanArchitecture.Application.Common.Interfaces;
using CleanArchitecture.Application.Common.Outbox;
using CleanArchitecture.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace CleanArchitecture.Infrastructure.Outbox;

public class OutboxProcessor : BackgroundService
{
    private const int MaxAttempts = 5;
    private const int BatchSize = 20;
    private static readonly TimeSpan PollInterval = TimeSpan.FromSeconds(20);

    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<OutboxProcessor> _logger;
    private readonly string _frontendOrigin;

    public OutboxProcessor(IServiceScopeFactory scopeFactory, ILogger<OutboxProcessor> logger, IConfiguration configuration)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
        // Same config key CORS already reads - it's the frontend's origin either way.
        _frontendOrigin = configuration["Cors:AllowedOrigin"] ?? "http://localhost:5173";
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await ProcessPendingMessagesAsync(stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while processing the outbox.");
            }

            try
            {
                await Task.Delay(PollInterval, stoppingToken);
            }
            catch (TaskCanceledException)
            {
                // Shutting down.
            }
        }
    }

    private async Task ProcessPendingMessagesAsync(CancellationToken cancellationToken)
    {
        using var scope = _scopeFactory.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<IApplicationDbContext>();
        var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();

        var pending = await context.OutboxMessages
            .Where(m => m.Status == OutboxMessageStatus.Pending)
            .OrderBy(m => m.CreatedAtUtc)
            .Take(BatchSize)
            .ToListAsync(cancellationToken);

        if (pending.Count == 0)
        {
            return;
        }

        foreach (var message in pending)
        {
            try
            {
                await DispatchAsync(message, emailService, _frontendOrigin, cancellationToken);
                message.MarkProcessed();
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to process outbox message {Id} ({Type})", message.Id, message.Type);
                message.MarkFailed(ex.Message, MaxAttempts);
            }
        }

        await context.SaveChangesAsync(cancellationToken);
    }

    private static async Task DispatchAsync(
        Domain.Entities.OutboxMessage message, IEmailService emailService, string frontendOrigin, CancellationToken cancellationToken)
    {
        switch (message.Type)
        {
            case OutboxMessageTypes.ReservationApprovedEmail:
            {
                var payload = JsonSerializer.Deserialize<ReservationApprovedEmailPayload>(message.Payload)
                    ?? throw new InvalidOperationException("Invalid ReservationApprovedEmail payload.");

                var body =
                    $"<p>Hi {payload.FullName},</p>" +
                    $"<p>Your reservation for <strong>{payload.CarName}</strong> (#{payload.ReservationId}) has been approved.</p>" +
                    $"<p>Total due: {payload.TotalAmount:C}. Please complete payment to proceed with pickup.</p>";

                await emailService.SendAsync(payload.Email, "Your GoDrive reservation was approved", body, cancellationToken);
                break;
            }

            case OutboxMessageTypes.ReservationRejectedEmail:
            {
                var payload = JsonSerializer.Deserialize<ReservationRejectedEmailPayload>(message.Payload)
                    ?? throw new InvalidOperationException("Invalid ReservationRejectedEmail payload.");

                var reasonText = string.IsNullOrWhiteSpace(payload.Reason) ? string.Empty : $"<p>Reason: {payload.Reason}</p>";
                var body =
                    $"<p>Hi {payload.FullName},</p>" +
                    $"<p>Your reservation for <strong>{payload.CarName}</strong> (#{payload.ReservationId}) was rejected.</p>" +
                    reasonText;

                await emailService.SendAsync(payload.Email, "Your GoDrive reservation was rejected", body, cancellationToken);
                break;
            }

            case OutboxMessageTypes.PasswordResetEmail:
            {
                var payload = JsonSerializer.Deserialize<PasswordResetEmailPayload>(message.Payload)
                    ?? throw new InvalidOperationException("Invalid PasswordResetEmail payload.");

                var resetLink =
                    $"{frontendOrigin}/reset-password?email={Uri.EscapeDataString(payload.Email)}&token={Uri.EscapeDataString(payload.Token)}";
                var body =
                    $"<p>Hi {payload.FullName},</p>" +
                    $"<p><a href=\"{resetLink}\">Click here to reset your GoDrive password</a>.</p>" +
                    $"<p>Or use this code directly on the reset password page:</p>" +
                    $"<p style=\"font-family:monospace;font-size:14px\">{payload.Token}</p>" +
                    $"<p>If you didn't request this, ignore this email.</p>";

                await emailService.SendAsync(payload.Email, "Reset your GoDrive password", body, cancellationToken);
                break;
            }

            default:
                throw new InvalidOperationException($"Unknown outbox message type '{message.Type}'.");
        }
    }
}
