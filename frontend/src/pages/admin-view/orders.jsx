import AdminOrdersView from "@/components/admin-view/orders";

function AdminOrders() {
    return (
        <div>
            {/* {getPaymentMethodDisplay(orderDetails?.paymentMethod)} */}
            <div>
                <AdminOrdersView />
            </div>
        </div>
    );
}

export default AdminOrders;