using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using Application.util;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Persistence;

namespace Application.Profiles
{
    public class Bio
    {
        public class Command : IRequest<Profile>
        {
            public string DisplayName { get; set; }
            public string Bio { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.DisplayName).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command, Profile>
        {
            private readonly UserManager<AppUser> _userManager;
            private readonly IUserAccessor _userAccessor;
            public Handler(UserManager<AppUser> userManager, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _userManager = userManager;
            }

            public async Task<Profile> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _userManager.FindByNameAsync(_userAccessor.GetCurrentUsername());

                user.DisplayName = request.DisplayName;
                user.Bio = request.Bio;

                var success = (await _userManager.UpdateAsync(user)).Succeeded;

                if (success)
                {
                    return Util.GenerateProfileFromUser(user);
                }

                throw new Exception("Problem saving changes");
            }
        }
    }
}