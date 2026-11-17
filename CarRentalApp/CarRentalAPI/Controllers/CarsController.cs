using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using CarRentalAPI.Model;
using System.Collections.Generic;

namespace CarRentalAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarsController : ControllerBase
    {
        private readonly string _connectionString = "Server=(localdb)\\MSSQLLocalDB;Database=CarRentalDB;Trusted_Connection=True;";

        [HttpGet]
        public ActionResult<IEnumerable<Car>> GetAvailableCars()
        {
            var cars = new List<Car>();

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                string query = "SELECT CarID, Brand, Model, PricePerDay, Status FROM Cars WHERE Status = 'Available'";

                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            cars.Add(new Car
                            {
                                CarID = reader.GetInt32(0),
                                Brand = reader.GetString(1),
                                Model = reader.GetString(2),
                                PricePerDay = reader.GetDecimal(3),
                                Status = reader.GetString(4)
                            });
                        }
                    }
                }
            }

            return Ok(cars);
        }
    }
}