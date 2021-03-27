<template>
  <div>
    <Breadcrumbs title="Application" />
    <!-- Container-fluid starts-->
    <div class="container-fluid">
      <div class="row default-according">
        <div class="col-md-3">
          <!-- <div v-if="!signedin" class="card">
                    <div class="card-header">
                      Please login
                    </div>
                </div> -->
          <!-- <div class="card">
                  <div class="card-header">
                    <h5>access_token</h5>
                    <input type="text" v-model="access_token" size="32" />
                  </div>
                </div> -->
          <div class="card">
            <div class="card-header">
              <h5>Businesses <button @click="getBusinesses()" class="btn btn-primary btn-xs">Refresh</button></h5>
            </div>
            <table class="table">
              <tr v-for="b in businesses" :key="b.id">
                <td>
                  <input type="checkbox" class="checkbox_animated" v-model="selected_bms" :value="b.id"
                    @change="getAdAccounts" />
                </td>
                <td>
                  <b>{{b.name}}</b><br>
                  {{b.id}}
                </td>
              </tr>
            </table>
          </div>
          <div class="card">
            <div class="card-header">
              <h5>Adaccounts <button @click="getAdAccounts()" class="btn btn-primary btn-xs">Refresh</button><span v-if="loading_accounts" class="loader-box" style="height: 24px; width: 24px;"><div class="loader-38"></div></span></h5>
              <span>Live: {{adaccounts_live}} - Die: {{adaccounts_die}}</span>
              <p>
                <input type="checkbox" class="checkbox_animated" v-model="show_active_adaccounts" />Active
                <input type="checkbox" class="checkbox_animated" v-model="show_disabled_adaccounts" />Disabled
              </p>
              <p>
                <input type="checkbox" class="checkbox_animated" v-model="show_pixel" />Show pixels
                <input type="checkbox" class="checkbox_animated" v-model="show_paymentmethod" />Show payment method
              </p>
            </div>
            <table class="table">
              <tr v-for="account in _adaccounts" :key="account.id">
                <td>
                  <input type="checkbox" class="checkbox_animated" v-model="selected_adaccounts" :value="account.id"
                    @change="refresh" />
                </td>
                <td>
                  <b>{{account.name}} </b>
                  <span v-if="account.account_status === 1" class="badge badge-success">ACTIVE</span>
                  <span v-else-if="account.account_status === 3" class="badge badge-secondary">UNSETTLE</span>
                  <span v-else-if="account.disable_reason === 3" class="badge badge-warning">UNUSUAL ACTIVITY</span>
                  <span v-else class="badge badge-secondary">DISABLED</span>
                  {{account.currency}} {{account.id}} <a
                    :href="'https://business.facebook.com/adsmanager/manage/campaigns?act=' + account.id.split('_')[1]"
                    target="_blank"><i class="fa fa-external-link"></i></a><br>
                  <!-- <p>
                                  <div role="group" class="btn-group"> -->
                  <!-- <button type="button" class="btn btn-xs btn-info">Left</button>
                                    <button type="button" class="btn btn-xs btn-info">Middle</button>
                                    <button type="button" class="btn btn-xs btn-info">Right</button> -->
                  <!-- <button @click="adaccount = account; getCampaigns()" class="btn btn-light btn-xs">Campaigns</button> 
                                    <button @click="adaccount = account; getAdsets()" class="btn btn-light btn-xs">Adsets</button> 
                                    <button @click="adaccount = account; getAds()" class="btn btn-light btn-xs">Ads</button> 
                                  </div>
                                </p> -->
                  <span>Timezone: {{account.timezone_id}}</span><br>
                  <template v-if="account.adspixels && show_pixel">
                    <span v-for="p in account.adspixels.data" :key="p.id">{{p.name}} - {{p.id}}<br></span>
                  </template>
                  <template v-if="account.funding_source_details && show_paymentmethod">
                    <span>Payment type: {{account.funding_source_details.type}}</span>
                  </template>
                </td>
                <!-- <td>{{account.owner.name}}</td> -->
              </tr>
            </table>
          </div>
        </div>
        <div class="col-md-9">
          <div class="card">
            <div class="card-header">
              <h5>Ads manger <button @click="refresh()" class="btn btn-primary btn-xs">Refresh</button><span v-if="loading" class="loader-box" style="height: 24px; width: 24px;"><div class="loader-38"></div></span></h5>
              <span>
                <p>
                  {{_selected_adaccounts.join(', ')}} - {{rows.length}} {{selected_tab}}
                </p>
                <p>
                  <input type="radio" name="date_preset" value="today" v-model="date_preset" class="radio_animated"
                    @change="refresh">Today <input type="radio" name="date_preset" class="radio_animated"
                    value="yesterday" v-model="date_preset" @change="refresh"> Yesterday <input type="radio"
                    name="date_preset" class="radio_animated" v-model="date_preset" value="maximum"
                    @change="refresh">Lifetime
                </p>
                <p>
                  <input type="checkbox" class="checkbox_animated" v-model="show_active" />Active <input
                    type="checkbox" class="checkbox_animated" v-model="show_paused" />Paused <input
                    type="checkbox" class="checkbox_animated" v-model="show_pending" />Pending | <input
                    type="checkbox" class="checkbox_animated" v-model="only_delivered" />Only delivered
                </p>
                <p>
                  <button class="btn btn-success btn-md" @click="setstatus('ACTIVE')">Turn on</button> <button class="btn btn-light btn-md" @click="setstatus('PAUSED')">Turn off</button> 
                  <button class="btn btn-success btn-md" @click="setbudget()">Set budget</button>
                  <button class="btn btn-danger btn-md" @click="del">Delete</button>
                  <input type="text" style="width: auto; display: inline-block" placeholder="access_token" v-model="access_token" class="form-control" @change="save('access_token', access_token); test_token()">{{access_token_debug.name || (access_token_debug.error && access_token_debug.error.message) || ''}}
                </p>
              </span>
            </div>
            <div class="tabs tabbed-card" slot="header">
              <ul role="tablist" class="nav nav-pills">
                <li role="presentation" class="nav-item"><a role="tab"
                    :class="'nav-link' + (selected_tab == 'campaigns' ? ' active' : '')"
                    @click="selected_tab = 'campaigns'; refresh()">Campaigns</a></li>
                <li role="presentation" class="nav-item"><a role="tab"
                    :class="'nav-link' + (selected_tab == 'adsets' ? ' active' : '')"
                    @click="selected_tab = 'adsets'; refresh()">Adsets</a></li>
                <li role="presentation" class="nav-item"><a role="tab"
                    :class="'nav-link' + (selected_tab == 'ads' ? ' active' : '')" @click="selected_tab = 'ads'; refresh()">Ads</a>
                </li>
              </ul>
            </div>
            <template v-if="selected_tab == 'ads'">
              <table class="table">
                <tr v-for="ad in rows" :key="ad.id">
                  <td>
                    <input type="checkbox" class="checkbox_animated" v-model="selected_ids" :value="ad.id" />
                  </td>
                  <td>
                    <b>{{ad.name}} </b>
                  </td>
                  <td>
                    <span
                      :class="'badge badge-' + (ad.effective_status == 'PENDING_REVIEW' ? 'warning' : ad.effective_status == 'ACTIVE' ? 'success' : ad.effective_status == 'CAMPAIGN_PAUSED' ? 'light' : 'secondary')">{{ad.effective_status}}</span>
                  </td>
                  <!-- <td>{{account.owner.name}}</td> -->
                </tr>
              </table>
            </template>
            <template v-if="selected_tab == 'campaigns'">
              <table class="table">
                <tr>
                  <td>
                    <input type="checkbox" class="checkbox_animated"
                      :checked="selected_ids.length == rows.length" @change="checkalltoggle" />
                  </td>
                  <td>
                    <template v-if="selected_ids.length">
                      {{selected_ids.length}} selected
                      <button class="btn btn-pill btn-air-light btn-outline-light btn-outline-light btn-xs" @click="selected_ids = []">x</button>
                    </template>
                    </td>
                  <td></td>
                  <td>Budget</td>
                  <td><b>{{amount_spent}}</b></td>
                  <td>
                    Unique link clicks
                  </td>
                  <td>
                    Unique content views
                  </td>
                  <td>
                    Unique ATC
                  </td>
                  <td>
                    Unique purchases
                  </td>
                  <td></td>
                </tr>
                <template v-for="c in rows">
                  <tr v-if="(show_camp_active && c.effective_status == 'ACTIVE') || (show_camp_paused && c.effective_status != 'ACTIVE')" :key="c.id">
                    <td>
                      <input type="checkbox" class="checkbox_animated" v-model="selected_ids" :value="c.id" />
                    </td>
                    <td>
                      {{c.name}}
                    </td>
                    <td>
                      <span
                        :class="'badge badge-' + (c.effective_status == 'PENDING_REVIEW' ? 'warning' : c.effective_status == 'ACTIVE' ? 'success' : c.effective_status == 'PAUSED' ? 'light' : 'secondary')">{{c.effective_status}}</span>
                    </td>
                    <td>
                      {{c.daily_budget.toLocaleString('en-US', { style: 'currency', currency: c.currency})}}
                    </td>
                    <td>
                      {{c.insights ? Number(c.insights.data[0].spend).toLocaleString('en-US', { style: 'currency', currency: c.currency}) : 0}}
                    </td>
                    <td>
                      {{c.link_click}}
                    </td>
                    <td>
                      {{c.omni_view_content}}
                    </td>
                    <td>
                      {{c.omni_add_to_cart}}
                    </td>
                    <td>
                      {{c.omni_purchase}}
                    </td>                       
                    <td>
                      {{c.cost_per_inline_post_engagement}}
                    </td>  
                    <!-- <td>{{account.owner.name}}</td> -->
                  </tr>
                </template>
              </table>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  // import func from 'vue-editor-bridge'
  export default {
    mounted() {
      this.getBusinesses()
      this.test_token()
    },
    data() {
      return {
        selected_ids: [],
        adaccounts: [],
        adaccounts_live: 0,
        adaccounts_die: 0,
        selected_adaccounts: [],
        selected_bms: [],
        businesses: [],
        bm: {},
        adaccount: '',
        ads: [],
        ad_summary: {
          pending: 0,
          active: 0
        },
        campaigns: [],
        selected_campaigns: [],
        adsets: [],
        show_active_adaccounts: true,
        show_disabled_adaccounts: false,
        show_pixel: false,
        show_paymentmethod: false,
        show_camp_active: true,
        show_camp_paused: true,
        show_active: true,
        show_paused: false,
        show_pending: true,
        access_tokens: {},
        access_token: '',
        selected_tab: 'campaigns',
        date_preset: 'today',
        loading: false,
        loading_accounts: false,
        access_token: localStorage.getItem('access_token'),
        access_token_debug: {},
        only_delivered: false
      }
    },
    // watch: {
    //   access_token: function () {
    //     if (isLocalStorage()) localStorage.setItem('access_token', this.access_token)
    //   }
    // },
    methods: {
      save (name, val) {
        localStorage.setItem(name, val)
      },
      test_token () {
        if (this.access_token) FB.api('/me', { fields: 'name', access_token: this.access_token }, res => {
          this.access_token_debug = res
          console.log(res)
          // this.businesses = res.businesses.data
        })
      },
      setstatus (s) {
          if (!confirm("Are you sure?")) return
          var batch = []
          this.selected_ids.forEach(id => {
            batch.push({
              method: "POST",
              relative_url: '/' + id,
              body: 'status=' + s
            })
          })
          if (batch.length) {
            this.loading = true
            FB.api('/', 'post', { batch, access_token: this.access_token }, res => {
              console.log(res)
              this.refresh()
            })
          }
      },
      del () {
        if (!confirm("Are you sure?")) return
        var batch = []
        this.selected_ids.forEach(id => {
          batch.push({
            method: "DELETE",
            relative_url: '/' + id
          })
        })
        if (batch.length) {
          this.loading = true
          FB.api('/', 'post', { batch, access_token: this.access_token }, res => {
            console.log(res)
            this.refresh()
          })
        }
      },
      setbudget (s) {
          var newbudget = prompt("Enter new budget");
          if (!newbudget) return
          var batch = []
          this.selected_ids.forEach(id => {
            batch.push({
              method: "POST",
              relative_url: '/' + id,
              body: 'daily_budget=' + newbudget * 100
            })
          })
          if (batch.length) {
            this.loading = true
            FB.api('/', 'post', { batch, access_token: this.access_token }, res => {
              console.log(res)
              this.refresh()
            })
          }
      },
      getBusinesses() {
        var params = {
          fields: 'businesses{name}'
        }
        // if (this.access_token) params.access_token = this.access_token

        FB.api('/me', params, res => {
          console.log(res)
          this.businesses = res.businesses.data
        })
      },
      refresh() {
        if (this.selected_tab == 'campaigns') this.getCampaigns()
        else this.getAds()
      },
      getAdAccounts() {
        if (!this.selected_bms.length) return
        this.loading_accounts = true
        FB.api('/', {
        fields: 'client_ad_accounts.limit(1000){name,account_status,disable_reason,currency,adspixels{name},funding_source_details,timezone_id},owned_ad_accounts.limit(1000){name,account_status,disable_reason,currency,adspixels{name},funding_source_details,timezone_id}',
        ids: this.selected_bms.join(','),
        limit: 1000,
        }, res => {
          this.loading_accounts = false
          var a = []
          console.log(res)
          // var { client_ad_accounts, owned_ad_accounts } = res
          for (var bm_id in res) {
            var bmdata = res[bm_id]
            // var data = bmdata.data || []
            var client_ad_accounts = bmdata.client_ad_accounts ? bmdata.client_ad_accounts.data : []
            var owned_ad_accounts = bmdata.owned_ad_accounts ? bmdata.owned_ad_accounts.data : []
            a = [...a, ...client_ad_accounts, ...owned_ad_accounts]
          }
          a.sort((x, y) => {
            return x.name > y.name ? 1 : -1
          })
          // this.selected_adaccounts = []
          this.adaccounts = a
          this.adaccounts_live = 0
          this.adaccounts_die = 0
          a.forEach(ac => {
            if (ac.account_status === 1) this.adaccounts_live++
            else this.adaccounts_die++
          })
        })
      },
      getAds() {
        if (!this.selected_adaccounts.length) return this.ads = []
        this.loading = true
        FB.api('/', {
          fields: 'ads.limit(1000){name,effective_status}',
          ids: this.selected_adaccounts.join(','),
          // summary: true,
          limit: 1000
        }, res => {
          this.loading = false
          console.log(res)
          // var { client_ad_accounts, owned_ad_accounts } = res
          var a = []
          for (var id in res) {
            if (!res[id].ads) continue
            var ads = res[id].ads.data
            a = [...a, ...ads]
          }

          // a.sort((x, y) => { return x.name > y.name ? 1 : -1 })
          this.ad_summary.pending = 0
          a.forEach(aa => {
            if (aa.effective_status == 'PENDING_REVIEW') this.ad_summary.pending++
          })
          this.ads = a
          // console.log(this.ads)
          // this.ad_summary = res.summary || {}
        })
      },
      getCampaigns() {
        if (!this.selected_adaccounts.length) return this.campaigns = []
        this.loading = true
        FB.api('/', {
          fields: 'currency,campaigns.limit(1000){name,effective_status,daily_budget,insights.date_preset(' + this.date_preset + '){unique_actions,account_currency,spend,cost_per_inline_post_engagement}}',
          // date_preset: 'today', //maximum today yesterday
          ids: this.selected_adaccounts.join(','),
          // summary: true,
          // limit: 1000
        }, res => {
          this.loading = false
          console.log(res)
          // var { client_ad_accounts, owned_ad_accounts } = res
          var c = []
          for (var id in res) {
            if (!res[id].campaigns) continue
            var camps = res[id].campaigns.data
            camps.forEach(_c => {
              _c.currency = res[id].currency
              if (_c.currency) _c.daily_budget = Number(_c.daily_budget) / 100
              if (_c.insights) {
                var { unique_actions } =  _c.insights.data[0]
                if (unique_actions) unique_actions.forEach(action => {
                  _c[action.action_type] = action.value
                })
              }
            })
            c = [...c, ...camps]
          }

          // a.sort((x, y) => { return x.name > y.name ? 1 : -1 })
          // this.ad_summary.pending = 0
          // a.forEach(aa => {
          //   if (aa.effective_status == 'PENDING_REVIEW') this.ad_summary.pending++
          // })
          // this.selected_campaigns = [].
          
          this.campaigns = c
          // console.log(this.ads)
          // this.ad_summary = res.summary || {}
        })
      },
      checkalltoggle() {
        if (this.selected_ids.length < this.rows.length) this.rows.forEach(c => {
          if (!this.selected_ids.includes(c.id)) this.selected_ids.push(c.id)
        })
        else this.selected_ids = []
      }
    },
    computed: {
      rows: function () {
        // this.selected_ids = []
        if (this.selected_tab == 'campaigns') return this.campaigns.filter(a => ((a.effective_status == 'ACTIVE' && this.show_active) || (a.effective_status != 'ACTIVE' && this.show_paused)) && ((this.only_delivered == (a.insights && Number(a.insights.data[0].spend) > 0) || !this.only_delivered)))

        var a = []
        if (this.selected_tab == 'ads') {
          this.ads.forEach(_a => {
            if (_a.effective_status == 'ACTIVE') { if (this.show_active) a.push(_a)}
            else if (_a.effective_status == 'PENDING_REVIEW' || _a.effective_status == 'IN_PROCESS') { if (this.show_pending) a.push(_a) }
            else if (this.show_paused) a.push(_a)
          })
        }
        return a
      },
      amount_spent: function () {
        var t = 0
        this.rows.forEach(c => {
          if (c.insights) t += Number(c.insights.data[0].spend)
        })
        return t.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        })
      },
      _adaccounts: function () {
        return this.adaccounts.filter(a => (a.account_status === 1 && this.show_active_adaccounts) || (a.account_status > 1 && this.show_disabled_adaccounts))
      },
      _selected_adaccounts: function () {
        var a = []
        this.adaccounts.forEach(_a => {
          if (this.selected_adaccounts.includes(_a.id)) a.push(_a.name)
        })
        return a
      }
    }
  }
</script>