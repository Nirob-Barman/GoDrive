using CleanArchitecture.Domain.Entities;
using CleanArchitecture.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace CleanArchitecture.Infrastructure.Persistence.Seed;

public static class CarSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        // Avoid duplicate seed data.
        if (await context.Cars.AnyAsync())
            return;

        var cars = new List<Car>
        {
            Car.Create(
                "Toyota Corolla 2022",
                "Toyota",
                "Corolla",
                2022,
                "A comfortable and fuel-efficient sedan, perfect for daily city commutes.",
                CarType.Sedan,
                FuelType.Petrol,
                TransmissionType.Automatic,
                5,
                600m,
                "Gulshan, Dhaka"
            ),

            Car.Create(
                "Honda Civic 2023",
                "Honda",
                "Civic",
                2023,
                "A stylish sedan with excellent handling, modern technology and premium comfort.",
                CarType.Sedan,
                FuelType.Petrol,
                TransmissionType.Automatic,
                5,
                1000m,
                "Banani, Dhaka"
            ),

            Car.Create(
                "BMW X5 2023",
                "BMW",
                "X5",
                2023,
                "A luxurious SUV offering exceptional performance, comfort and spacious interiors.",
                CarType.SUV,
                FuelType.Diesel,
                TransmissionType.Automatic,
                5,
                2500m,
                "Gulshan, Dhaka"
            ),

            Car.Create(
                "Mercedes-Benz C-Class 2022",
                "Mercedes-Benz",
                "C-Class",
                2022,
                "An elegant luxury sedan with advanced safety features and a premium interior.",
                CarType.Sedan,
                FuelType.Petrol,
                TransmissionType.Automatic,
                5,
                2000m,
                "Dhanmondi, Dhaka"
            ),

            Car.Create(
                "Hyundai Tucson 2023",
                "Hyundai",
                "Tucson",
                2023,
                "A modern family SUV with spacious seating and a smooth driving experience.",
                CarType.SUV,
                FuelType.Petrol,
                TransmissionType.Automatic,
                5,
                1500m,
                "Uttara, Dhaka"
            ),

            Car.Create(
                "Tesla Model 3 2024",
                "Tesla",
                "Model 3",
                2024,
                "A fully electric sedan featuring modern technology and impressive acceleration.",
                CarType.Sedan,
                FuelType.Electric,
                TransmissionType.Automatic,
                5,
                2200m,
                "Bashundhara, Dhaka"
            ),

            Car.Create(
                "Honda Vezel 2022",
                "Honda",
                "Vezel",
                2022,
                "A compact hybrid SUV offering excellent fuel economy and everyday practicality.",
                CarType.SUV,
                FuelType.Hybrid,
                TransmissionType.Automatic,
                5,
                1100m,
                "Mirpur, Dhaka"
            ),

            Car.Create(
                "Toyota Axio 2021",
                "Toyota",
                "Axio",
                2021,
                "A reliable and economical sedan suitable for comfortable city travel.",
                CarType.Sedan,
                FuelType.Hybrid,
                TransmissionType.Automatic,
                5,
                500m,
                "Mohammadpur, Dhaka"
            ),
            Car.Create(
                "Toyota Land Cruiser Prado 2023",
                "Toyota",
                "Land Cruiser Prado",
                2023,
                "A premium off-road SUV with powerful performance, luxury interiors and advanced safety.",
                CarType.SUV,
                FuelType.Diesel,
                TransmissionType.Automatic,
                7,
                3500m,
                "Gulshan, Dhaka"
            ),

            Car.Create(
                "Mitsubishi Outlander 2022",
                "Mitsubishi",
                "Outlander",
                2022,
                "A versatile family SUV with comfortable seating and excellent driving stability.",
                CarType.SUV,
                FuelType.Petrol,
                TransmissionType.Automatic,
                7,
                1800m,
                "Uttara, Dhaka"
            ),

            Car.Create(
                "Nissan X-Trail 2023",
                "Nissan",
                "X-Trail",
                2023,
                "A practical and stylish SUV with spacious interiors and modern technology.",
                CarType.SUV,
                FuelType.Hybrid,
                TransmissionType.Automatic,
                5,
                1700m,
                "Banani, Dhaka"
            ),

            Car.Create(
                "Mazda 3 2022",
                "Mazda",
                "3",
                2022,
                "A sporty compact sedan with refined styling and responsive handling.",
                CarType.Sedan,
                FuelType.Petrol,
                TransmissionType.Automatic,
                5,
                1200m,
                "Dhanmondi, Dhaka"
            ),

            Car.Create(
                "Suzuki Swift 2023",
                "Suzuki",
                "Swift",
                2023,
                "A compact and economical hatchback ideal for navigating busy city streets.",
                CarType.Hatchback,
                FuelType.Petrol,
                TransmissionType.Automatic,
                5,
                450m,
                "Mirpur, Dhaka"
            ),

            Car.Create(
                "Porsche 911 2023",
                "Porsche",
                "911",
                2023,
                "An iconic sports car delivering thrilling performance and premium driving comfort.",
                CarType.Coupe,
                FuelType.Petrol,
                TransmissionType.Automatic,
                2,
                6500m,
                "Gulshan, Dhaka"
            ),

            Car.Create(
                "Kia Sportage 2024",
                "Kia",
                "Sportage",
                2024,
                "A modern SUV with bold styling, comfortable interiors and advanced features.",
                CarType.SUV,
                FuelType.Petrol,
                TransmissionType.Automatic,
                5,
                1600m,
                "Bashundhara, Dhaka"
            ),

            Car.Create(
                "BYD Atto 3 2024",
                "BYD",
                "Atto 3",
                2024,
                "A fully electric compact SUV with modern technology and a comfortable cabin.",
                CarType.SUV,
                FuelType.Electric,
                TransmissionType.Automatic,
                5,
                1900m,
                "Banani, Dhaka"
            )




        };

        context.Cars.AddRange(cars);

        // Save first so each car has its database-generated ID.
        await context.SaveChangesAsync();

        // Add images through the aggregate root.
        cars[0].AddImage(
            "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80",
            "seed-toyota-corolla"
        );

        cars[1].AddImage(
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
            "seed-honda-civic"
        );

        cars[2].AddImage(
            "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80",
            "seed-bmw-x5"
        );

        cars[3].AddImage(
            "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80",
            "seed-mercedes-c-class"
        );

        cars[4].AddImage(
            "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
            "seed-hyundai-tucson"
        );

        cars[5].AddImage(
            "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80",
            "seed-tesla-model-3"
        );

        cars[6].AddImage(
            "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80",
            "seed-honda-vezel"
        );

        cars[7].AddImage(
            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
            "seed-toyota-axio"
        );

        cars[8].AddImage(
            "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80",
            "seed-toyota-prado"
        );

        cars[9].AddImage(
            "https://images.unsplash.com/photo-151 SUV?auto=format&fit=crop&w=1200&q=80",
            "seed-mitsubishi-outlander"
        );

        cars[10].AddImage(
            "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80",
            "seed-nissan-xtrail"
        );

        cars[11].AddImage(
            "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80",
            "seed-mazda-3"
        );

        cars[12].AddImage(
            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
            "seed-suzuki-swift"
        );

        cars[13].AddImage(
            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
            "seed-porsche-911"
        );

        cars[14].AddImage(
            "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80",
            "seed-kia-sportage"
        );

        cars[15].AddImage(
            "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80",
            "seed-byd-atto-3"
        );


        await context.SaveChangesAsync();
    }
}
