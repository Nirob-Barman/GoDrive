namespace CleanArchitecture.Api.Controllers.Requests;

public class UpdateReviewRequest
{
    public int Rating { get; set; }
    public string? Comment { get; set; }
}
