import React from 'react'
// import styled from 'styled-components'
import $ from 'jquery'
import styled from 'styled-components'
import { AutoColumn } from '../Column'
// import { AutoColumn } from '../Column'
//
const MobilePopupWrapper = styled.div<{ height: string | number }>`
  position: relative;
  max-width: 100%;
  height: ${({ height }) => height};
  margin: ${({ height }) => (height ? '20 auto;' : 20)};
  padding-top: 20px;
  margin-bottom: ${({ height }) => (height ? '20px' : 0)}
}

;

display:${'block'}

;
${({ theme }) => theme.mediaWidth.upToSmall`
    display: block;
  `};
`
//
// const MobilePopupInner = styled.div`
//   height: 99%;
//   overflow-x: auto;
//   overflow-y: hidden;
//   display: flex;
//   flex-direction: row;
//   -webkit-overflow-scrolling: touch;
//   ::-webkit-scrollbar {
//     display: none;
//   }
// `
//
const FixedPopupColumn = styled(AutoColumn)`
  position: fixed;
  top: 64px;
  right: 1rem;
  max-width: 355px;
  width: 100%;
  z-index: 2;
  float: left;
`

export default function Graphs() {
  // MARK: Get All Graphs
  $(window).on('load', function() {
    $('#chart-content-div').load('https://info.uniswap.org/home #test-idAREA')
  })

  return (
    <>
      <FixedPopupColumn></FixedPopupColumn>
      <MobilePopupWrapper height={'fit-content'}>
        <div id="chart-content-div">
          <script type="text/javascript"></script>
          <img src="/images/chart.png" height="416px" />
        </div>
      </MobilePopupWrapper>
    </>
  )
}
