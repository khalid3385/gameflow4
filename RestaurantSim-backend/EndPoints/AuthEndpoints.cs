using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace RestaurantSim.Endpoints;

public static class AuthEndpoints
{
    public static IEndpointRouteBuilder MapAuthEndpoints(
        this IEndpointRouteBuilder endpoints)
    {
        var auth = endpoints.MapGroup("/auth");

        auth.MapIdentityApi<IdentityUser>();

        auth.MapGet("/me", async (
            ClaimsPrincipal claimsPrincipal,
            UserManager<IdentityUser> userManager) =>
        {
            var user = await userManager.GetUserAsync(claimsPrincipal);
            if (user is null)
            {
                return Results.Unauthorized();
            }

            return Results.Ok(new
            {
                user.Id,
                user.UserName,
                user.Email
            });
        });
        // .RequireAuthorization();

        auth.MapPost("/logout", async (
            SignInManager<IdentityUser> signInManager) =>
        {
            await signInManager.SignOutAsync();
            return Results.NoContent();
        });

        return endpoints;
    }
}
