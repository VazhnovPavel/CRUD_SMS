using System;
namespace CRUDBackend.Models
{
    public class Employee
    {
        public int ID { get; set; }
        public DateTime Time {get; set;}
        public string? Name { get; set; }
        public string? Phone { get; set; }
        public string? Sms { get; set; }
        public string? isActive { get; set; }
    }
}

