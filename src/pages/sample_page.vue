<template>
    <div>
        <Breadcrumbs title="Application"/>
        <!-- Container-fluid starts-->
        <div class="container-fluid">
            <div class="row">
              <div class="col-md-12">
                <!-- <div v-if="!signedin" class="card">
                    <div class="card-header">
                      Please login
                    </div>
                </div> -->
                <div class="card">
                    <div class="card-header">
                      <h5>Account list</h5><span>lorem ipsum dolor sit amet, consectetur adipisicing elit</span>
                    </div>
                    <div class="card-body">
                      <button @click="getAccounts()" class="btn btn-primary">Refresh</button>
                      <table class="table">
                        <tr>
                          <th></th>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Status</th>
                          <th>Currency</th>
                        </tr>
                        <tr v-for="account in adAccounts" :key="account.id">
                          <td></td>
                          <td>{{account.id}}</td>
                          <td>{{account.name}}</td>
                          <td>
                            <span v-if="account.account_status === 1" class="badge badge-success">ACTIVE</span>
                            <span v-else-if="account.account_status === 3" class="badge badge-secondary">UNSETTLE</span>
                            <span v-else-if="account.disable_reason === 3" class="badge badge-warning">UNUSUAL ACTIVITY</span>
                            <span v-else class="badge badge-secondary">DISABLED</span>
                          </td>
                          <td>{{account.currency}}</td>
                          <!-- <td>{{account.owner.name}}</td> -->
                        </tr>
                      </table>
                    </div>
                </div>
              </div>               
            </div>
        </div>
        <!-- Container-fluid Ends-->
    </div>
</template>

<script>
export default {
  data () {
    return {
      adAccounts: []
    }
  },
  methods: {
    getAccounts() {
      FB.api('/me/adaccounts', { fields: 'name,account_status,disable_reason,currency,owner{name}'}, res => {
        console.log(res)
        this.adAccounts = res.data
      })
    }
  }
}
</script>