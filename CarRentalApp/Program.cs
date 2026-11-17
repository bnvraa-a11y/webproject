using System;
using Microsoft.Data.SqlClient;

class Program
{
    static void Main()
    {
        string connectionString = "Server=(localdb)\\MSSQLLocalDB;Database=CarRentalDB;Trusted_Connection=True;";

        using (SqlConnection connection = new SqlConnection(connectionString))
        {
            try
            {
                connection.Open();
                Console.WriteLine("Connected to CarRentalDB successfully!");

                string query = "SELECT CarID, Brand, Model, PricePerDay FROM Cars WHERE Status = 'Available'";
                
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        Console.WriteLine("\n--- Available Cars ---");
                        while (reader.Read())
                        {
                            Console.WriteLine($"ID: {reader["CarID"]} | Car: {reader["Brand"]} {reader["Model"]} | Price/Day: {reader["PricePerDay"]}");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred: {ex.Message}");
            }
        }
    }
}