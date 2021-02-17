import { gql } from 'apollo-boost';

const users = gql`
{
    users{
        name
        email
        address
        dob
    }
}
`

const addUser = gql`
mutation($name: String!, $email: String!, $password: String!, $dob: String!, $address: String!){
    addUser(name: $name, email: $email, password: $password, dob: $dob, address: $address){
      name
      email
      password
      address
    }
}
`
// const addReport = gql`
// mutation($image: String!, $address: String!, $location: String!, $userID: String!, $resolved: Boolean!, $noOfReports: int!){
//     addReport(image: $image, address: $address, location: $location, userID: $userID, resolved: $resolved, noOfReports: $noOfReports){
//      image,
//      address,
//      location,
//      userID,
//      resolved,
//      noOfReports
//     }
// }
// `

const loginQuery = gql`
  mutation($email:String!, $password: String!){
    login(email:$email, password:$password){
      name
      email
      password
      address
      dob
      token
    }
  }
`;


export { users, addUser, loginQuery };