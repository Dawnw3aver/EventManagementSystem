﻿using CSharpFunctionalExtensions;
using EventManagement.Core.Models;
using EventManagement.Core.ValueObjects;

namespace EventManagement.Core.Abstractions
{
    public interface IEventsRepository
    {
        Task<Guid> Create(Event @event);
        Task<Guid> Delete(Guid eventId);
        Task<Result> AddImages(Guid eventId, List<string> imageUrls);
        Task<Result> Join(Guid eventId, User user);
        Task<Result> Leave(Guid eventId, User user);
        Task<List<Event>> Get();
        Task<Result<Event>> GetById(Guid eventId);
        Task<Guid> Update(Guid eventId, string title, string description, DateTime startDate, DateTime endDate, Location location, bool isActive);
    }
}