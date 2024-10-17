namespace EventManagement.API.Contracts
{
    public record UsersResponse
    (
        Guid UserId,
        string Email,
        string UserName,
        string PhoneNumber,
        string FirstName,
        string MiddleName,
        string LastName,
        DateTime BirthDate,
        List<string> Roles
    );
}
