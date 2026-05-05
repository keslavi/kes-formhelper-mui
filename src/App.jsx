import { Container } from '@mui/material';
import './App.css'
import {
  Col,
  ContainerFullWidth,
  Row,
  RowHeader,
} from './components';


const App=()=> {

  return (
    <ContainerFullWidth>
      <h1>Formhelper-Mui</h1>
      <Row>
        <Col>col 1</Col>
        <Col>col 2</Col>
        <Col>col 3</Col>  
        <Col>col 4</Col>
      </Row>

    </ContainerFullWidth>
  )
}

export default App
