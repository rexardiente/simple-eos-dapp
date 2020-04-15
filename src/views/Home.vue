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
          <b-button @click="verify_identity()" variant="primary" class="w-100 mt-3">
            Sign-in with Scatter
          </b-button>
        </v-row>
        <hr>

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
  import Vue from 'vue';
  import Vuex from 'vuex';
  import { Api, JsonRpc, RpcError } from 'eosjs';
  import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';
  import ScatterJS from 'scatterjs-core';
  import ScatterEOS from 'scatterjs-plugin-eosjs';
  import fetch from 'node-fetch'; // node only; not needed in browsers

  Vue.use(Vuex); // init Vuex

  const store = new Vuex.Store({
    state: {
      scatter: '',
      network: '',
      EOS_API: '',
      EOS_RPC: '',
    },
    mutations: {
      setScatter (state, x, y) {
        state.scatter = x;
        state.network = y;
      },
      setEOS (state, x, y) {
        state.EOS_API = x;
        state.EOS_RPC = y;
      },
    },
    actions: {
      setScatter (context, x, y) {
        context.commit('setScatter', x, y)
      },
      setEOS (context, x, y) {
        context.commit('setEOS', x, y)
      },
    }
  });

  // 5JvLodQJeoyQ2JhrMFaykcMs4BQx2ZGzhYnRG4pyRNosCiWQ21P
  const defaultPrivateKey = "5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3"; // eosio.token
  const signatureProvider = new JsSignatureProvider([defaultPrivateKey]);
  const { TextEncoder, TextDecoder } = require('text-encoding');  // React Native, IE11, and Edge Browsers only

  const rpc = new JsonRpc('http://127.0.0.1:8888', { fetch });
  const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

  store.dispatch('setEOS', rpc, api);

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
    created() {
      //  Initialized EOS on page load
      this.init_scatter();

      // check if signin function is working..
      // this.init_scatter().then(() => {
      //   this.verify_identity();
      // }).catch(() => {
      //   window.alert("Your wallet App is not running, Please check and try again.");
      // });
    },
    methods: {
      init_scatter: async () => {
        // Testnet configuration network..
        const network = {
          accounts: [{
            blockchain:'eos',
            protocol:'http',
            host:'jungle2.cryptolions.io',
            port:80,
            chainId:'e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473'
          }]
        }

        // Don't forget to tell ScatterJS which plugins you are using.
        ScatterJS.plugins( new ScatterEOS() );

        // First we need to connect to the user's Scatter.
        return ScatterJS.scatter.connect("16-panel-game").then((connected) => {
          // User does not have Scatter Desktop, Mobile or Classic installed.
            if(!connected) return false;

            /*
             * The initial connection with Scatter has a little bit of overhead, * so you really only want one persistent reference to the ScatterJS * object through-out your application's lifecycle.
             */
            // const scatter = ScatterJS.scatter; // do not use this.
            store.dispatch('setScatter', ScatterJS.scatter, network);
            return true;
        });
      },
      logout: () => {
        /*
         * Always remember to null out the window.ScatterJS reference, if you
         * don't extensions will be able to catch that reference and make
         * requests to the user's Scatter on behalf of your domain, and you
         * will have to take responsibility.
         */
        window.ScatterJS = null;
      },
      verify_identity: () => {
        // Now we need to get an identity from the user.
        // We're also going to require an account that is connected to the network we're using.
        store.state.scatter.getIdentity(store.state.network).then(() => {
          window.alert("Account Verified. Congratulations!!!");
        }).catch(() => {
          // The user rejected this request, or doesn't have the appropriate requirements.
          window.alert("Auth request has been declined.");
          // window,alert("error", err);
        });
      },
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

  // Networks are used to reference certain blockchains.
  // They let you get accounts and help you build signature providers.
  //     if(!connected) return console.error('no scatter');

  //     const eos = ScatterJS.eos(network, Api, {rpc});

  //     ScatterJS.login().then(id => {
  //         if(!id) return console.error('no identity');
  //         const account = ScatterJS.account('eos');

  //         eos.transact({
  //             actions: [{
  //                 account: 'eosio.token',
  //                 name: 'transfer',
  //                 authorization: [{
  //                     actor: account.name,
  //                     permission: account.authority,
  //                 }],
  //                 data: {
  //                     from: account.name,
  //                     to: 'safetransfer',
  //                     quantity: '0.0001 EOS',
  //                     memo: account.name,
  //                 },
  //             }]
  //         }, {
  //             blocksBehind: 3,
  //             expireSeconds: 30,
  //         }).then(res => {
  //             console.log('sent: ', res);
  //         }).catch(err => {
  //             console.error('error: ', err);
  //         });
  //     });
  // });
</script>
