import React from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { Container, Header, Content, Footer, FooterTab, Button, Icon } from 'native-base'
import { Col, Row, Grid } from "react-native-easy-grid";

export default function Test() {
    return (
        <Container>
            <Grid>
                <Col style={{ backgroundColor: '#635DB7'}}></Col>
                <Col style={{ backgroundColor: '#00CE9F'}}></Col>
            </Grid>
        </Container>
    )
}
