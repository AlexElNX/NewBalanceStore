using Xunit;
using NewBalanceStore.Application.DTOs;

namespace NewBalanceStore.UnitTests.Tests
{
    public class DtoMappingTests
    {
        [Fact]
        public void CreateOrderDto_ShouldCorrectlyInitializeProperties()
        {
            var customerName = "Ivan Ivanov";
            var customerEmail = "test@example.com";
            var customerPhone = "+359888888888";
            var address = "Vasil Levski 10, Sofia";

            var dto = new CreateOrderDto
            {
                CustomerName = customerName,
                CustomerEmail = customerEmail,
                CustomerPhone = customerPhone,
                ShippingAddress = address,
                Items = new List<CreateOrderItemDto>
                {
                    new CreateOrderItemDto
                    {
                        ProductId = 101,
                        Color = "Black",
                        Size = "42",
                        Quantity = 2
                    }
                }
            };

            Assert.NotNull(dto);
            Assert.Equal(customerName, dto.CustomerName);
            Assert.Equal(customerEmail, dto.CustomerEmail);
            Assert.Equal(customerPhone, dto.CustomerPhone);
            Assert.Equal(address, dto.ShippingAddress);
            Assert.Single(dto.Items);
            Assert.Equal(101, dto.Items[0].ProductId);
            Assert.Equal("Black", dto.Items[0].Color);
            Assert.Equal("42", dto.Items[0].Size);
            Assert.Equal(2, dto.Items[0].Quantity);
        }

        [Fact]
        public void CreateOrderDto_DefaultItemsList_ShouldNotBeNull()
        {
            var dto = new CreateOrderDto();

            Assert.NotNull(dto.Items);
            Assert.Empty(dto.Items);
        }
    }
}