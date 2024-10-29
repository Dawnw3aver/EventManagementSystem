using EventManagement.DataAccess;
using Microsoft.AspNetCore.Mvc;
using EventManagement.Core.Models;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/v1/[controller]")]
public class LogsController : ControllerBase
{
    private readonly EventManagementDbContext _context;

    public LogsController(EventManagementDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<LogEntry>>> GetLogs(int page = 1, int pageSize = 10)
    {
        var logs = await _context.LogEntries
            .OrderByDescending(log => log.Timestamp)
            //.Skip((page - 1) * pageSize)
            //.Take(pageSize)
            .ToListAsync();

        return Ok(logs);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<LogEntry>> GetLog(Guid id)
    {
        var log = await _context.LogEntries.FindAsync(id);

        if (log == null)
        {
            return NotFound();
        }

        return Ok(log);
    }
}