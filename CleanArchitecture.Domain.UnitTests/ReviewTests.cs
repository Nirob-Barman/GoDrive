using CleanArchitecture.Domain.Entities;
using FluentAssertions;

namespace CleanArchitecture.Domain.UnitTests;

public class ReviewTests
{
    [Theory]
    [InlineData(1)]
    [InlineData(5)]
    public void Create_accepts_ratings_within_range(int rating)
    {
        var review = Review.Create(1, "user-1", rating, "Great car");

        review.Rating.Should().Be(rating);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(6)]
    public void Create_rejects_ratings_outside_range(int rating)
    {
        var act = () => Review.Create(1, "user-1", rating, "Great car");

        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void Update_changes_rating_and_comment_and_stamps_updated_time()
    {
        var review = Review.Create(1, "user-1", 3, "It was okay");

        review.Update(5, "Actually excellent!");

        review.Rating.Should().Be(5);
        review.Comment.Should().Be("Actually excellent!");
        review.UpdatedAtUtc.Should().NotBeNull();
    }

    [Fact]
    public void Update_rejects_ratings_outside_range()
    {
        var review = Review.Create(1, "user-1", 3, "It was okay");

        var act = () => review.Update(0, "bad");

        act.Should().Throw<ArgumentException>();
    }
}
