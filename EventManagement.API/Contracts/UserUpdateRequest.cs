namespace EventManagement.API.Contracts
{
    public record UserUpdateRequest
    (
        string? Email,
        string? UserName,
        string? PhoneNumber,
        string?  FirstName,
        string? MiddleName,
        string? LastName,
        DateTime? BirthDate,
        List<string> Roles
    );
}
