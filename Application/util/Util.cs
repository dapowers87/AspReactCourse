using System.Linq;
using Application.Profiles;
using Domain;

namespace Application.util
{
    public static class Util
    {
        public static Profile GenerateProfileFromUser(AppUser user)
        {
            return new Profile
            {
                DisplayName = user.DisplayName,
                Username = user.UserName,
                Image = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
                Photos = user.Photos,
                Bio = user.Bio
            };
        }
    }
}