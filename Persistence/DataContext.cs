using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence;

public class DataContext : IdentityDbContext<AppUser>
{
    public DataContext(DbContextOptions options) : base(options)
    {
    }

    public DbSet<Activity> Activities { get; set; }
    public DbSet<ActivityAttendee> ActivityAttendees { get; set; }
    public DbSet<Photo> Photos { get; set; }
    public DbSet<Comment> Comments { get; set; }
    public DbSet<UserFollowing> UserFollowings { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<ActivityAttendee>(x => x.HasKey(aa => new { aa.AppUserId, aa.ActivityId }));

        builder.Entity<ActivityAttendee>()
            .HasOne(x => x.AppUser)
            .WithMany(x => x.Activities)
            .HasForeignKey(aa => aa.AppUserId);

        builder.Entity<ActivityAttendee>()
            .HasOne(x => x.Activity)
            .WithMany(x => x.Attendees)
            .HasForeignKey(aa => aa.ActivityId);

        builder.Entity<Comment>()
            .HasOne(x => x.Activity)
            .WithMany(x => x.Comments)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<UserFollowing>(b =>
        {
            b.HasKey(x => new {x.ObserverId, x.TargetId});

            b.HasOne(x => x.Observer).WithMany(x=>x.Followings)
                .HasForeignKey(o=>o.ObserverId)
                .OnDelete(DeleteBehavior.Cascade);

            b.HasOne(x => x.Target).WithMany(x=>x.Followers)
                .HasForeignKey(o=>o.TargetId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}