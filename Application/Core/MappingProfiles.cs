using Application.Activities;
using Application.Comments;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Activity, Activity>();
            CreateMap<Activity, ActivityDto>()
                .ForMember(x => x.HostUserName, o => o.MapFrom(s => s.Attendees
                    .FirstOrDefault(k => k.IsHost).AppUser.UserName));
            CreateMap<ActivityAttendee, AttendeeDto>()
            .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
            .ForMember(d => d.UserName, o => o.MapFrom(s => s.AppUser.UserName))
            .ForMember(d => d.Bio, o => o.MapFrom(s => s.AppUser.Bio))
            .ForMember(x => x.Image, o => o.MapFrom(a=> a.AppUser.Photos.FirstOrDefault(s=>s.IsMain).Url));

            CreateMap<AppUser, Profiles.Profile>()
            .ForMember(x => x.Image, o => o.MapFrom(a=> a.Photos.FirstOrDefault(s=>s.IsMain).Url));
            CreateMap<Comment, CommentDto>()
                .ForMember(x=>x.DisplayName, o=>o.MapFrom(a=>a.Author.DisplayName))
                .ForMember(x=>x.UserName, o=>o.MapFrom(a=>a.Author.UserName))
                .ForMember(x => x.Image, o => o.MapFrom(a=> a.Author.Photos.FirstOrDefault(s=>s.IsMain).Url));
        }
    }
}