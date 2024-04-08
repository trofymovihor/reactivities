using Application.Activities;
using Application.Comments;
using Application.Profiles;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : AutoMapper.Profile
    {
        public MappingProfiles()
        {
            string currentUsername = null;
            Console.WriteLine($"Current username is :  {currentUsername}");
            CreateMap<Activity, Activity>();
            CreateMap<Activity, ActivityDto>()
                .ForMember(x => x.HostUserName, o => o.MapFrom(s => s.Attendees
                    .FirstOrDefault(k => k.IsHost).AppUser.UserName));
            CreateMap<ActivityAttendee, AttendeeDto>()
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
                .ForMember(d => d.UserName, o => o.MapFrom(s => s.AppUser.UserName))
                .ForMember(d => d.Bio, o => o.MapFrom(s => s.AppUser.Bio))
                .ForMember(x => x.Image, o => o.MapFrom(a => a.AppUser.Photos.FirstOrDefault(s => s.IsMain).Url))
                .ForMember(x => x.FollowersCount, o => o.MapFrom(s => s.AppUser.Followers.Count))
                .ForMember(x => x.FollowingCount, o => o.MapFrom(s => s.AppUser.Followings.Count))
                .ForMember(x => x.Following, o => o.MapFrom(s => s.AppUser.Followers.Any(x => x.Observer.UserName == currentUsername)));

            CreateMap<AppUser, Profiles.Profile>()
            .ForMember(x => x.Image, o => o.MapFrom(a => a.Photos.FirstOrDefault(s => s.IsMain).Url))
                .ForMember(x => x.FollowersCount, o => o.MapFrom(s => s.Followers.Count))
                .ForMember(x => x.FollowingCount, o => o.MapFrom(s => s.Followings.Count))
                .ForMember(x => x.Following, o => o.MapFrom(s => s.Followers.Any(x => x.Observer.UserName == currentUsername)));

            CreateMap<Comment, CommentDto>()
                .ForMember(x => x.DisplayName, o => o.MapFrom(a => a.Author.DisplayName))
                .ForMember(x => x.UserName, o => o.MapFrom(a => a.Author.UserName))
                .ForMember(x => x.Image, o => o.MapFrom(a => a.Author.Photos.FirstOrDefault(s => s.IsMain).Url));

            CreateMap<ActivityAttendee, UserActivityDto>()
                .ForMember(d => d.Id, o => o.MapFrom(s => s.Activity.Id))
                .ForMember(d => d.Date, o => o.MapFrom(s => s.Activity.Date))
                .ForMember(d => d.Title, o => o.MapFrom(s => s.Activity.Title))
                .ForMember(d => d.Category, o => o.MapFrom(s =>
                    s.Activity.Category))
                .ForMember(d => d.HostUserName, o => o.MapFrom(s =>
                    s.Activity.Attendees.FirstOrDefault(x =>
                    x.IsHost).AppUser.UserName));
        }
    }
}