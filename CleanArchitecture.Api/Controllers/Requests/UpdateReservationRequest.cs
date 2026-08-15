namespace CleanArchitecture.Api.Controllers.Requests;

public class UpdateReservationRequest
{
    public DateTime PickupDate { get; set; }
    public DateTime DropoffDate { get; set; }
}
