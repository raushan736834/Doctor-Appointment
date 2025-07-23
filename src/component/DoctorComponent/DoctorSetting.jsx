import { Tab, TabList, Tabs, TabPanels, TabPanel } from "@chakra-ui/react";
import React from "react";
import DoctorPersonalInfo from "./DoctorPersonalInfo";

function DataTabs({ data }) {
  return (
    <Tabs>
      <TabList>
        {data.map((tab, index) => (
          <Tab key={index} className="font-semibold">{tab.label}</Tab>
        ))}
      </TabList>
      <TabPanels>
        {data.map((tab, index) => (
          <TabPanel p={4} key={index}>
            {tab.content}
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
}

const tabData = [
  {
    label: 'Doctor Profile',
    content: <DoctorPersonalInfo/>,
  },
  {
    label: 'Password',
    content:
      'Perhaps the surest dish ever invented but fills the stomach more than rice.',
  }
];

const DoctorSetting = () => {
  return (
    <main>
      <div className="m-2 flex justify-start">
        <span className="font-semibold text-lg">Setting</span>
      </div>
      <div className="m-4">
        <DataTabs data={tabData} />
      </div>
    </main>
  );
};

export default DoctorSetting;
