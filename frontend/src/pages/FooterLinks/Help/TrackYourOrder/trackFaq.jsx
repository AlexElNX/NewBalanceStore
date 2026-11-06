import { Link } from "react-router-dom";

export function getTrackFaq(accountLink, listClass) {
    return [
        {
            id: "expect-order",
            question: "When should I expect my order?",
            answer: (
                <>
                    <p>In-stock items ship within 2 business days. Carrier delivery times go into effect once your order has shipped. UPS does not deliver on weekends or holidays.</p>
                    <ul className={listClass}>
                        <li><strong>UPS Ground</strong> - 2-5 business days once shipped</li>
                        <li><strong>UPS 2-Day Air</strong> - 2 business days once shipped</li>
                        <li><strong>UPS 1-Day Air</strong> - 1 business day once shipped</li>
                        <li><strong>USPS</strong> (used for PO Boxes, Alaska, Hawaii and other US Territories, APO/FPO addresses) - 2-7 business days once shipped</li>
                    </ul>
                    <p>You will receive a shipping confirmation email with tracking when your order ships. For more information about shipping rates and details, <Link to="/shipping">click here</Link>.</p>
                </>
            )
        },
        {
            id: "when-arrive",
            question: "How can I tell when my order is going to arrive?",
            answer: (
                <>
                    <p>You will receive a shipping confirmation email with tracking when your order ships. If your order is split into more than one shipment, you will receive separate emails for each shipment.</p>
                    <p>Additionally, you can track your order by <Link to={accountLink}>logging into your account</Link> and opening your order history.</p>
                </>
            )
        },
        {
            id: "delivered-missing",
            question: "My order says it’s delivered but I can’t find it. Can you help?",
            answer: (
                <>
                    <p>If your tracking information shows that your package was delivered, but you can't find it:</p>
                    <ol>
                        <li>Verify the order was placed with the correct address by checking your order or shipping confirmation emails.</li>
                        <li>Wait for the full estimated shipping time frame to pass. Packages may show as delivered for up to 2 business days prior to actual arrival.</li>
                        <li>Still missing your order? Report a delivery issue <Link to="/help">here</Link>.</li>
                    </ol>
                </>
            )
        },
        {
            id: "multiple-shipments",
            question: "Why did my order ship in multiple shipments?",
            answer: (
                <p>Because we have several warehouses, orders with multiple items may ship from more than one location. If your order is split into more than one shipment, you will receive separate tracking emails for each shipment.</p>
            )
        },
        {
            id: "no-email",
            question: "I can’t find my shipping confirmation email. Can I track my order?",
            answer: (
                <p>Yes, you can track your order by <Link to={accountLink}>logging into your account</Link> and opening your order history.</p>
            )
        },
        {
            id: "pending",
            question: "Why is my order in “Pending” status?",
            answer: (
                <p>This means our team is processing your order for shipment. You will receive a shipping confirmation email with tracking when your order ships. In-stock items ship within 2 business days.</p>
            )
        },
        {
            id: "missing-late",
            question: "What should I do if my order is missing, late, lost, arrives damaged, or is incorrect?",
            answer: (
                <>
                    <p><strong>Late, Lost, Damaged in Transit, or Wrong Item Received</strong></p>
                    <p>Please allow up to 48 hours after tracking shows “delivered,” as some packages may arrive later or be left in mailrooms, building offices, or with neighbors. Still missing your order or received the wrong item(s)? <Link to="/help">Report a delivery issue.</Link></p>
                    <p><strong>Missing Items</strong></p>
                    <p>Your shipment may be split if some products were unavailable. Remaining items will ship as soon as they’re in stock. You can track your order in <Link to={accountLink}>order history</Link>.</p>
                    <p><strong>Freight Forwarding</strong></p>
                    <p>If you use a freight forwarding company, New Balance is not responsible for lost, stolen, or damaged packages. Orders delivered to a freight forwarder are considered fulfilled and are at your own risk.</p>
                </>
            )
        },
        {
            id: "cancel",
            question: "I just placed an order. Can I cancel it?",
            answer: (
                <p>To cancel an order, contact our <Link to="/help">Customer Care team</Link> as soon as possible after placing it. If your order has already shipped, you can return it according to our <Link to="/returns">return policy</Link>.</p>
            )
        }
    ];
}