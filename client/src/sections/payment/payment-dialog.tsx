import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import StripeCheckout from 'react-stripe-checkout';
import { STRIPE_PUBLISHABLE_KEY } from "../../config";

interface PD {
    open: boolean;
    closeDialog: () => void;
    amount: number;
    stripePayHandler: (token?: any) => void;
}

const PaymentDialog = ({ open, closeDialog, amount, stripePayHandler }: PD) => {
  return (
    <Dialog open={open} onClose={closeDialog}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
            <DialogContentText>Please proceed to pay</DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={closeDialog}>Cancel</Button>
            <StripeCheckout
                key={STRIPE_PUBLISHABLE_KEY}
                stripeKey={STRIPE_PUBLISHABLE_KEY}
                label='Credit Card'
                currency='USD'
                name='Credit/Debit Card'
                billingAddress
                shippingAddress
                amount={amount * 100}
                description={`Your payable charge will be ${amount}`}
                token={stripePayHandler}
            />
        </DialogActions>
    </Dialog>
  )
}

export default PaymentDialog