using System.Collections.Generic;
using System.Net;

namespace EventManagement.Application.ResponseSchemas
{
    public class ReverseGeocodingResponse
    {
        public int placeid { get; set; }
        public string licence { get; set; }
        public string osmtype { get; set; }
        public long osmid { get; set; }
        public string lat { get; set; }
        public string lon { get; set; }
        public string category { get; set; }
        public string type { get; set; }
        public int placerank { get; set; }
        public double importance { get; set; }
        public string addresstype { get; set; }
        public string name { get; set; }
        public string display_name { get; set; }
        public Address address { get; set; }
        public List<string> boundingbox { get; set; }
    }

    public class Address
    {
        public string office { get; set; }
        public string housenumber { get; set; }
        public string road { get; set; }
        public string quarter { get; set; }
        public string suburb { get; set; }
        public string city { get; set; }
        public string town { get; set; }
        public string village { get; set; }
        public string hamlet { get; set; }
        public string state { get; set; }
        public string iso3166_2_lvl4 { get; set; }
        public string region { get; set; }
        public string postcode { get; set; }
        public string country { get; set; }
        public string countrycode { get; set; }
    }
}
