import React, { useState, useEffect } from 'react'
import { Text, View, Dimensions } from 'react-native'
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
} from "react-native-chart-kit";
import { flowRight as compose } from 'lodash';
import { graphql } from 'react-apollo'
import { addBaseReport, addReport, decrypt, existingBaseCoordinate } from '../queries/query'

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;

const Nearby = (props) => {

    const [chartData, setChartData] = useState(null)

    useEffect(() => {

        var temp = {}

        console.log("asdjnjasd: ", props.decrypt.decrypt.reports)

        if (typeof(props.decrypt.decrypt.reports) != 'undefined') {
            console.log("Running")
            props.decrypt.decrypt.reports.map((report, key) => {
                var t = (report.reportedAt).split(" ")
                if (typeof (temp.t) == 'undefined') {
                    temp[t[3]] = {}
                    if (typeof (temp.t[3].t[1]) == 'undefined') {
                        temp[t[3][t[1]]] = 1
                    }
                    else {
                        tempt[3].t[1] = tempt[3].t[1] + 1
                    }
                } else {
                    if (typeof (temp.t[3].t[1]) == 'undefined') {
                        temp[t[3][t[1]]] = 1
                    }
                    else {
                        tempt[3].t[1] = tempt[3].t[1] + 1
                    }
                }
                console.log("Temp: ", temp)
            })
        }

        //console.log("Temp: ", temp)


    }, [props.decrypt.decrypt.reports])

    return (
        <LineChart
            data={{
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                datasets: [
                    {
                        data: [
                            Math.random() * 100,
                            Math.random() * 100,
                            Math.random() * 100,
                            Math.random() * 100,
                            Math.random() * 100,
                            Math.random() * 100
                        ]
                    }
                ]
            }}
            width={width * 0.66} // from react-native
            height={height * 0.25}
            yAxisLabel="$"
            yAxisSuffix="k"
            withHorizontalLabels={false}
            withVerticalLabels={false}
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
                backgroundColor: "#e26a00",
                backgroundGradientFrom: props.backgroundGradientFrom,
                backgroundGradientTo: props.backgroundGradientTo,
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                    borderRadius: 16
                },
                propsForDots: {
                    r: "6",
                    strokeWidth: "2",
                    stroke: "#ffa726"
                }
            }}
            bezier
            style={{
                marginVertical: 8,
                borderRadius: 16,
                paddingRight: 0,
            }}
        />
    )
}

export default compose(
    graphql(decrypt, {
        name: "decrypt",
        options: () => {
            return {
                variables: {
                    token: global.tempo
                }
            }
        }
    })
)(Nearby)