using MediatR;
using Microsoft.AspNetCore.Mvc;
using NewBalanceStore.Application.CQRS.Orders.Commands;
using NewBalanceStore.Application.CQRS.Orders.Queries;
using NewBalanceStore.Application.DTOs;

namespace NewBalanceStore.WebApi.Controllers
{
    /// <summary>
    /// Контролер для оформлення та управління клієнтськими замовленнями через MediatR (CQRS).
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly IMediator _mediator;

        /// <summary>
        /// Ініціалізує новий екземпляр контролера <see cref="OrdersController"/>.
        /// </summary>
        /// <param name="mediator">Шина медіатора для команд та запитів.</param>
        public OrdersController(IMediator mediator)
        {
            _mediator = mediator;
        }

        /// <summary>
        /// Створити нове замовлення.
        /// </summary>
        [HttpPost]
        [ProducesResponseType(typeof(OrderDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Create([FromBody] CreateOrderDto dto)
        {
            var result = await _mediator.Send(new CreateOrderCommand(dto));
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        /// <summary>
        /// Отримати детальну інформацію про замовлення за його ідентифікатором.
        /// </summary>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(OrderDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById(int id)
        {
            var order = await _mediator.Send(new GetOrderByIdQuery(id));
            if (order == null) return NotFound();
            return Ok(order);
        }

        /// <summary>
        /// Оновити статус виконання замовлення.
        /// </summary>
        [HttpPatch("{id}/status")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
        {
            await _mediator.Send(new UpdateOrderStatusCommand(id, status));
            return NoContent();
        }
    }
}