import { StatusBar } from "expo-status-bar";
import { useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import axios from "axios";
import * as Network from "expo-network";

export default function App() {
  const ref1 = useRef(null);

  const apiBase = "https://www.test.melabari.com";

  const [action, setAction] = useState("new");
  const [userId, setUserId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const checkNetworkStatus = async () => {
    const networkState = await Network.getNetworkStateAsync();
    return networkState.isConnected;
  };

  const [data, setData] = useState([]);

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.firstName}</Text>
      <Text style={styles.cell}>{item.lastName}</Text>
      <TouchableOpacity
        style={[styles.cell]}
        onPress={(e) => {
          setUserId(item.userId);
          setFirstName(item.firstName);
          setLastName(item.lastName);
          setAction("update");
        }}
      >
        <Text style={{ textAlign: "center" }}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.cell]}
        onPress={(e) => {
          RemoveUser(item.userId);
        }}
      >
        <Text style={{ textAlign: "center" }}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const AddUer = () => {
    if (firstName == "" || lastName == "") {
      alert("Pleas input al field");
      return;
    }

    setUserId("");
    setFirstName("");
    setLastName("");

    ref1.current.focus();

    userSend();
  };

  const UpdateUer = () => {
    data.map((item) => {
      if (item.userId == userId) {
        item.firstName = firstName;
        item.lastName = lastName;
      }
    });

    setData([...data]);

    setUserId("");
    setFirstName("");
    setLastName("");
    setAction("new");

    ref1.current.focus();

    userUpdate();
  };

  const RemoveUser = (id) => {
    const newData = data.filter((item) => item.userId !== id);
    setData([...newData]);

    userDelete(id);
  };

  const userLoad = () => {
    console.log("Connection", checkNetworkStatus());

    if (checkNetworkStatus() == false) {
      console.log("No internet connection");
      return;
    }

    // Making the GET request
    axios
      .get(`${apiBase}/api/User/GetUser`)
      .then((response) => {
        setData(response.data.Data);
        console.log(response.data.Data);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  };

  const userSend = () => {
    axios
      .post(`${apiBase}/api/User/AddUser`, {
        FirstName: firstName,
        LastName: lastName,
      })
      .then((res) => {
        //response

        userLoad();
      })
      .catch((error) => {
        console.error("There was an error posting the data!", error);
      });
  };

  const userUpdate = () => {
    axios
      .post(`${apiBase}/api/User/UpdateUser`, {
        UserId: userId,
        FirstName: firstName,
        LastName: lastName,
      })
      .then((res) => {
        //response
      })
      .catch((error) => {
        console.error("There was an error posting the data!", error);
      });
  };

  const userDelete = (id) => {
    axios
      .post(`${apiBase}/api/User/DeleteUser/${id}`, null)
      .then((res) => {
        //response
      })
      .catch((error) => {
        console.error("There was an error posting the data!", error);
      });
  };

  useEffect(() => {
    userLoad();
  }, []);

  return (
    <SafeAreaView>
      <StatusBar style="auto" />

      <View style={styles.container}>
        <View style={styles.content}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {action == "new" ? (
              <Text style={{ fontSize: 20 }}>Add User Info</Text>
            ) : (
              <Text style={{ fontSize: 20 }}>Update User Info</Text>
            )}
          </View>

          <View
            style={{
              marginTop: 10,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={styles.inputContenter}>
              <TextInput
                ref={ref1}
                style={styles.inputText}
                placeholder="First Name"
                placeholderTextColor={"#868788"}
                onChangeText={(e) => {
                  setFirstName(e);
                }}
                value={firstName}
              ></TextInput>
            </View>
          </View>

          <View
            style={{
              marginTop: 10,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={styles.inputContenter}>
              <TextInput
                style={styles.inputText}
                placeholder="Last Name"
                placeholderTextColor={"#868788"}
                onChangeText={(e) => {
                  setLastName(e);
                }}
                value={lastName}
              ></TextInput>
            </View>
          </View>

          <View style={{ marginTop: 10 }}>
            {action == "new" ? (
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  AddUer();
                }}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  UpdateUer();
                }}
              >
                <Text style={styles.buttonText}>Update</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={{ marginTop: 20 }}>
            <FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={(item) => item.userId}
              ListHeaderComponent={
                <View style={styles.header}>
                  <Text style={styles.headerText}>First Name</Text>
                  <Text style={styles.headerText}>Last Name</Text>
                  <Text style={styles.headerText}>Action</Text>
                </View>
              }
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "left",
    justifyContent: "center",
  },
  content: {
    marginTop: 150,
    marginLeft: 50,
    marginRight: 50,
  },
  underline: { textDecorationLine: "underline" },
  inputContenter: {
    width: "100%",
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#DDE2E6",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputText: {
    height: 35,
    width: "100%",
    fontWeight: "400",
    fontSize: 15,
    color: "#868788",
    paddingLeft: 10,
    paddingRight: 20,
  },
  button: {
    width: 70,
    height: 35,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#DDE2E6",
    backgroundColor: "green",
    justifyContent: "center",
  },
  buttonText: {
    fontWeight: "400",
    fontSize: 15,
    color: "#ffffff",
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    paddingVertical: 10,
  },
  headerText: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  cell: {
    flex: 1,
    textAlign: "center",
  },
});
