<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-img
          :src="require('../assets/logo.svg')"
          class="my-3"
          contain
          height="200"
        />
      </v-col>

      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          EOS Dapp
        </h1>

        <v-row class="justify-content-center">
          <v-col class="col">
            <v-text-field
                id="issuer"
                name="issuer"
                label="issuer name"
              ></v-text-field>
            <v-text-field
                id="maximum_supply"
                name="maximum_supply"
                label="maximum supply"
              ></v-text-field>
          </v-col>
          <v-col class="col">
            <v-text-field
                id="getBlock"
                name="getBlock"
                label="block #"
              ></v-text-field>
          </v-col>
          <v-col class="col">
            <v-text-field
                id="getAccount"
                name="getAccount"
                label="Account Name"
              ></v-text-field>
          </v-col>
        </v-row>
        <v-row class="justify-content-center">
          <v-col class="col">
            <b-button @click="create_issuer()" variant="primary" class="w-100 mt-3">
              Create Account
            </b-button>
          </v-col>
          <v-col class="col">
            <b-button @click="get_block()" variant="primary" class="w-100 mt-3">
              Get Block
            </b-button>
          </v-col>
          <v-col class="col">
            <b-button @click="get_account()" variant="primary" class="w-100 mt-3">
              Get Account
            </b-button>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  const { Api, JsonRpc, RpcError } = require('eosjs');
  const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig'); // development only
  const fetch = require('node-fetch'); // node only; not needed in browsers

  // 5JvLodQJeoyQ2JhrMFaykcMs4BQx2ZGzhYnRG4pyRNosCiWQ21P
  const defaultPrivateKey = "5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3"; // eosio.token
  const signatureProvider = new JsSignatureProvider([defaultPrivateKey]);
  const { TextEncoder, TextDecoder } = require('text-encoding');  // React Native, IE11, and Edge Browsers only

  const rpc = new JsonRpc('http://127.0.0.1:8888', { fetch });
  const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

  export default {
    name: 'Home',
    data() {
      return {
        getBlock: '',
        privateKey: ''
      };
    },
    mounted() {
      // setInterval(this.get_block, 1000);
    },
    methods: {
      create_issuer: async () => {
        try {
          const result = await api.transact({
            actions: [{
              account: 'eosio.token',
              name: 'create',
              authorization: [{
                actor: 'eosio.token',
                permission: 'active',
              }],
              data: {
                issuer: document.getElementById("issuer").value,
                maximum_supply: document.getElementById("maximum_supply").value,
              },
            }]
          }, {
            blocksBehind: 3,
            expireSeconds: 30,
          }).then(() => {
            //  Clean input field...
            document.getElementById("issuer").value = '';
            document.getElementById("maximum_supply").value = '';
          });

          console.log(result);
          result;
        } catch(e) {
          if (e instanceof RpcError)
            console.log(e.json.error.details[0].message);
          else {
            console.log("error");
          }
        }
      },
      user_greet: async () => {
        try {
          const result = await api.transact({
            actions: [{
              account: 'eosio.token',
              name: 'hi',
              authorization: [{
                actor: 'user2',
                permission: 'active',
              }],
              data: {
                user: "user2",
                // maximum_supply: document.getElementById("maximum_supply").value,
              },
            }]
          }, {
            blocksBehind: 3,
            expireSeconds: 30,
          });

          console.log(result);
          result;
        } catch(e) {
          if (e instanceof RpcError)
            console.log(e.json.error.details[0].message);
        }
      },
      get_account: async () => {
        const input = document.getElementById("getAccount").value;
        console.log(await rpc.get_account(input));
        document.getElementById("getAccount").value = '';
      },
      get_block: async () => {
        const input = document.getElementById("getBlock").value;
        console.log(await rpc.get_block(input));
        document.getElementById("getBlock").value = '';
      },
    }
  };
</script>
