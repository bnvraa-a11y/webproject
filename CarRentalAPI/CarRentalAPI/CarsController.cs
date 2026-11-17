
using Microsoft.AspNetCore.Mvc;

[Route("api/cars")]
[ApiController]
public class CarsController : ControllerBase
{
    [HttpGet]
    public IActionResult GetCars()
    {
        var cars = new[]
        {
            new
            {
                Id = 1,
                Brand = "Tesla",
                Model = "Model Y",
                Price = 70,
                ImageUrl = "/os.webp"
            },
            new
            {
                Id = 2,
                Brand = "BMW",
                Model = "4",
                Price = 50,
                ImageUrl = "/OIP (1) copy.webp"
            },
            new
            {
                Id = 3,
                Brand = "Audi",
                Model = "A6 Avant",
                Price = 120,
                ImageUrl = "/audi6.webp"
            },
            new
            {
                Id = 4,
                Brand = "Rolls-Royce",
                Model = "Ghost",
                Price = 150,
                ImageUrl = "/rolls.webp"
            }
        };

        return Ok(cars);
    }
}
