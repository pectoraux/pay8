import React from 'react'
import JoyRide from 'react-joyride'

const Tour = ({ steps, launch }) => {
  return (
    <>
      <JoyRide
        run={launch}
        steps={steps}
        continuous={true}
        showSkipButton={true}
        showProgress={true}
        styles={{
          tooltipContainer: {
            textAlign: 'left',
          },
          buttonNext: {
            backgroundColor: 'green',
          },
          buttonBack: {
            marginRight: 10,
          },
        }}
      />
    </>
  )
}

export default Tour
