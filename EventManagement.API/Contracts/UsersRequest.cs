namespace EventManagement.API.Contracts
{
    public record UsersRequest
    (
        string Email,
        string Password,
        string UserName,
        string PhoneNumber,
        string FirstName,
        string MiddleName,
        string LastName,
        DateTime BirthDate,
        List<string> Roles
    );
}
