using CSharpFunctionalExtensions;
using EventManagement.Core.ValueObjects;

namespace EventManagement.Core.Abstractions
{
    public interface ILocationService
    {
        Task<Result<Location>> CreateLocation(string location);
    }
}