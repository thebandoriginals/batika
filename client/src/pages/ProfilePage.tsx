import { Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react"
import OrdersList from "../sections/profile/orders-list";

const ProfilePage = () => {

  const [tabValue, setTabValue] = useState<number>(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const TABS = [
    <Typography>Profile</Typography>,
    <OrdersList />
  ]

  return (
    <>
      <Tabs sx={{ mb: 3 }} variant='fullWidth' value={tabValue} onChange={handleChange}>
        <Tab label='Profile' />
        <Tab label='My Orders' />
      </Tabs>

      {TABS[tabValue]}
    </>
  )
}

export default ProfilePage