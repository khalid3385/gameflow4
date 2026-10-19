using System.Globalization;
using System.Security.Cryptography;

namespace RestaurantSim.Services;

public static class SessionCodeGenerator
{
    public static string Generate()
    {
        var number = RandomNumberGenerator.GetInt32(0, 1_000_000);

        return number.ToString("D6", CultureInfo.InvariantCulture);
    }
}