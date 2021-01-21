import React, { useState, useEffect, useContext } from 'react'
// import styled from 'styled-components'
import styled, { ThemeContext } from 'styled-components'
import { AutoColumn } from '../Column'
import { Line } from 'react-chartjs-2'
// import { AutoColumn } from '../Column'
import axios from 'axios'
import { ChartOptions } from 'chart.js'

//

interface SwapDayData {
  dailyVolumeETH: string
  dailyVolumeUSD: string
  date: number
  id: string
  totalLiquidityETH: string
  totalLiquidityUSD: string
  __typename: string
}

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
  `}

;
`

// const ChartInner = styled.div`
//   @import url("https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css");
//   @import url("https://fonts.googleapis.com/css?family=Montserrat:400,700");
//
//   body {
//     background: #384051;
//     color: rgba(255, 255, 255, 0.3);
//     font-family: "Montserrat", sans-serif;
//   }
//
//   .credit {
//     width: 560px;
//     margin: 9em auto 3em auto;
//     text-align: center;
//     font-size: 0.75em;
//   }
//
//   a {
//     text-decoration: none;
//     color: #21A6EE;
//   }
//
//   .ion-social-dribbble {
//     color: #EC4989;
//   }
//
//   .chart {
//     position: relative;
//     width: 560px;
//     height: 260px;
//     margin: 3em auto;
//     background-image: repeating-radial-gradient(center center, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1) 2px, transparent 2px, transparent 100%);
//     background-size: 29px 29px;
//     background-position: -11px 11px;
//   }
//
//   .chart::before,
//   .chart::after {
//     display: inline-block;
//     font-size: 0.875em;
//   }
//
//   .chart::before {
//     display: inline-block;
//     position: absolute;
//     left: -3.5em;
//     top: -5px;
//     content: "$4k \\a$3k \\a$2k \\a$1k \\a 0";
//     white-space: pre;
//     height: 100%;
//     line-height: 4.2;
//     text-align: right;
//   }
//
//   .chart::after {
//     content: "00:00h 21:00h";
//     width: 110%;
//     margin-left: -5%;
//     word-spacing: 36.5em;
//     padding-top: 0.5em;
//   }
//
//   .dataset {
//     fill-opacity: 0.8;
//     filter: url(#dropshadow);
//   }
//
//   #dataset-1 {
//     fill: #50E3C2;
//   }
//
//   #dataset-2 {
//     fill: #21A6EE;
//   }
//
//   #dataset-3 {
//     fill: #807CCC;
//   }
//
//   .chart button {
//     position: relative;
//     top: -0.75em;
//     border: none;
//     background: rgba(255, 255, 255, 0.5);
//     color: #384051;
//     border-radius: 5px;
//     padding: 0.25em 1em;
//     font-size: 1em;
//     float: right;
//     cursor: pointer;
//   }
//
//   .chart button:focus {
//     outline: none;
//   }
//
//   @-webkit-keyframes raise {
//     0% {
//       transform: scaleY(0.01);
//     }
//     75% {
//       transform: scaleY(1.1);
//     }
//     100% {
//       transform: scaleY(1);
//     }
//   }
//
//   @keyframes raise {
//     0% {
//       transform: scaleY(0.01);
//     }
//     75% {
//       transform: scaleY(1.1);
//     }
//     100% {
//       transform: scaleY(1);
//     }
//   }
//
//   .dataset {
//     transform-origin: bottom;
//     transform: scaleY(0.01);
//     opacity: 0.5;
//   }
//
//   .loaded .dataset {
//     opacity: 1;
//     -webkit-animation: raise 0.5s ease 0.2s forwards;
//     animation: raise 0.5s ease 0.2s forwards;
//   }
//
//   .loaded #dataset-1 {
//     -webkit-animation-delay: 0.2s;
//     animation-delay: 0.2s;
//   }
//
//   .loaded #dataset-2 {
//     -webkit-animation-delay: 0.1s;
//     animation-delay: 0.1s;
//   }
//
//   .loaded #dataset-3 {
//     -webkit-animation-delay: 0s;
//     animation-delay: 0s;
//   }
// `

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

const CharInner = styled.div`
  width: 600px;
  height: 416px;
  color: white;
`

const graphAPI: string = `https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2`

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
  const getDate = (ts: Date): string => {
    const month: number = ts.getMonth() + 1
    const day: number = ts.getDate()

    return `${month}/${day}`
  }

  const initData: number[] = []
  const initLabels: string[] = []

  const [subData, setSubData] = useState(initData)
  const [labels, setLabels] = useState(initLabels)
  const theme = useContext(ThemeContext)
  useEffect(() => {
    if (labels.length > 0 || subData.length > 0) {
      return
    }
    axios
      .post(
        graphAPI,
        {
          operationName: 'uniswapDayDatas',
          variables: {
            startTime: 1579651198,
            skip: 0
          },
          query:
            'query uniswapDayDatas($startTime: Int!, $skip: Int!) {\n  uniswapDayDatas(first: 1000, skip: $skip, where: {date_gt: $startTime}, orderBy: date, orderDirection: asc) {\n    id\n    date\n    totalVolumeUSD\n    dailyVolumeUSD\n    dailyVolumeETH\n    totalLiquidityUSD\n    totalLiquidityETH\n    __typename\n  }\n}\n'
        },
        {
          headers: {
            // origin: 'https://info.uniswap.org',
            // referer: 'https://info.uniswap.org/',
            // 'Access-Control-Allow-Origin': '*'
          }
        }
      )
      .then(resp => {
        const resultData: any = resp.data
        const arrays: SwapDayData[] = resultData.data.uniswapDayDatas

        let totalLiquidities: number[] = []
        let totalLabels: string[] = []
        for (let i = arrays.length - 60; i < arrays.length; i++) {
          totalLiquidities.push(Number(arrays[i].totalLiquidityUSD))
          totalLabels.push(getDate(new Date(arrays[i].date * 1000)))
        }

        setSubData(totalLiquidities)
        setLabels(totalLabels)
      })
  }, [labels, subData])

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Daily Liquidity in USD',
        data: subData,
        fill: 'start',
        backgroundColor: 'rgba(170, 94, 255, 0.2)',
        borderColor: 'rgb(170,94,255)'
      }
    ]
  }

  const options: ChartOptions = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            // @ts-ignore
            userCallback: (value, index, values) => {
              value = value.toString()
              value = value.split(/(?=(?:...)*$)/)
              value = value.join(',')
              return value
            },
            fontColor: theme.text1
          }
        }
      ],
      xAxes: [
        {
          ticks: {
            fontColor: theme.text1
          }
        }
      ]
    },
    maintainAspectRatio: false,
    legend: {
      labels: {
        fontColor: theme.text1
      },
    },
    tooltips: {
      bodyFontColor: theme.text1
    },
    title: {
      display: true,
      text: 'Liquidity',
      fontColor: theme.text1,
      fontSize: 24
    }
  }

  return (
    <>
      <FixedPopupColumn />
      <MobilePopupWrapper height={'fit-content'}>
        <CharInner>
          <div id="chart-content-div" className="loaded">
            <Line data={data} options={options} height={400} />
          </div>
        </CharInner>
      </MobilePopupWrapper>
    </>
  )
}
