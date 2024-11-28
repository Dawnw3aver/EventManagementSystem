using CSharpFunctionalExtensions;
using EventManagement.Application.ResponseSchemas;
using EventManagement.Core.Abstractions;
using EventManagement.Core.ValueObjects;
using System.Globalization;
using System.Text.Json;

namespace EventManagement.Application.Services
{
    public class LocationService : ILocationService
    {
        public async Task<Result<Location>> CreateLocation(string location)
        {
            Thread.CurrentThread.CurrentCulture = CultureInfo.InvariantCulture;
            // Проверяем формат строки
            var parts = location.Split(',');
            if (parts.Length != 2 ||
                !double.TryParse(parts[0], out var latitude) ||
                !double.TryParse(parts[1], out var longitude))
            {
                return Result.Failure<Location>("Invalid coordinates format.");
            }

            string url = $"https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat={latitude}&lon={longitude}&accept-language=ru";


            using var httpClient = new HttpClient();
            httpClient.DefaultRequestHeaders.UserAgent.TryParseAdd("Mozilla/5.0 (compatible; AcmeInc/1.0)");  // Добавляем User-Agent, так как Nominatim этого требует
            var response = await httpClient.GetAsync(url);

            if (!response.IsSuccessStatusCode)
                return Result.Failure<Location>("Failed to fetch location data from Nominatim.");

            var jsonResponse = await response.Content.ReadAsStringAsync();
            var locationData = JsonSerializer.Deserialize<ReverseGeocodingResponse>(jsonResponse);

            if (locationData == null)
                return Result.Failure<Location>("No location data found for the given coordinates.");

            // Создаем объект Location на основе ответа
            string address = locationData.display_name;
            string country = locationData.address.country;
            string city = locationData.address.city ?? locationData.address.town ?? locationData.address.village ?? locationData.address.hamlet;
            return Location.Create(address, country, city, latitude, longitude);
        }
    }
}
