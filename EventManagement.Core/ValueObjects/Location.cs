using CSharpFunctionalExtensions;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace EventManagement.Core.ValueObjects
{
    [ComplexType]
    public class Location : ValueObject
    {
        public string Address { get; private set; } = string.Empty; // Полный адрес
        public string Country { get; private set; } = string.Empty; // Страна
        public string City { get; private set; } = string.Empty; // Город
        public double Latitude { get; private set; } // Широта
        public double Longitude { get; private set; } // Долгота

        private Location(string address, string country, string city, double latitude, double longitude)
        {
            Address = address;
            Country = country;
            City = city;
            Latitude = latitude;
            Longitude = longitude;
        }

        public static Result<Location> Create(string address, string country, string city, double latitude, double longitude)
        {
            StringBuilder error = new();

            // Проверка на пустые строки
            if (string.IsNullOrWhiteSpace(address))
                error.AppendLine("Address cannot be empty.");

            if (string.IsNullOrWhiteSpace(country))
                error.AppendLine("Country cannot be empty.");

            if (string.IsNullOrWhiteSpace(city))
                error.AppendLine("City cannot be empty.");

            // Валидация координат
            if (latitude < -90 || latitude > 90)
                error.AppendLine("Latitude must be between -90 and 90.");

            if (longitude < -180 || longitude > 180)
                error.AppendLine("Longitude must be between -180 and 180.");

            // Если есть ошибки, возвращаем их
            if (error.Length > 0)
                return Result.Failure<Location>(error.ToString());

            // Если ошибок нет, создаем объект и возвращаем успешный результат
            var location = new Location(address, country, city, latitude, longitude);
            return Result.Success(location);
        }

        // Для сравнения значений с учетом точности координат
        protected override IEnumerable<object> GetEqualityComponents()
        {
            // Округляем координаты для сравнения с заданной точностью
            yield return Math.Round(Latitude, 6);
            yield return Math.Round(Longitude, 6);
        }
    }
}
