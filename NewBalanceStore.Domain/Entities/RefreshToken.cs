namespace NewBalanceStore.Domain.Entities;

public class RefreshToken
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Token { get; set; } = null!;
    public string UserId { get; set; } = null!; 
    public DateTime ExpiresOnUtc { get; set; }
    public bool IsExpired => DateTime.UtcNow >= ExpiresOnUtc;
    public DateTime CreatedOnUtc { get; set; } = DateTime.UtcNow;
    public DateTime? RevokedOnUtc { get; set; }
    public bool IsActive => RevokedOnUtc == null && !IsExpired;
}