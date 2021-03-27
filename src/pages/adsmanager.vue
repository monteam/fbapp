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
              <h5>Adaccounts <button @click="getAdAccounts()" class="btn btn-primary btn-xs">Refresh</button></h5>
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
                    @change="getAds" />
                </td>
                <td>
                  <b>{{account.name}} </b>
                  <span v-if="account.account_status === 1" class="badge badge-success">ACTIVE</span>
                  <span v-else-if="account.account_status === 3" class="badge badge-secondary">UNSETTLE</span>
                  <span v-else-if="account.disable_reason === 3" class="badge badge-warning">UNUSUAL ACTIVITY</span>
                  <span v-else class="badge badge-secondary">DISABLED</span>
                  {{account.currency}} {{account.id}} <a
                    :href="'https://business.facebook.com/adsmanager/manage/campaigns?act=' + account.id"
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
              <h5>Pending Ads <button @click="getAds()" class="btn btn-primary btn-xs">Refresh</button></h5>
              <span>Pending: {{ad_summary.pending}}</span>
            </div>
            <div class="card-body">
              <!---->
              <!---->
              <div class="tabs tabbed-card" slot="header" id="__BVID__3995">
                <!---->
                <div class="">
                  <ul role="tablist" class="nav nav-pills" id="__BVID__3995__BV_tab_controls_">
                    <!---->
                    <li role="presentation" class="nav-item"><a role="tab" aria-selected="true" aria-setsize="3"
                        aria-posinset="1" target="_self" href="#" class="nav-link active"
                        id="__BVID__3996___BV_tab_button__" aria-controls="__BVID__3996">Home</a></li>
                    <li role="presentation" class="nav-item"><a role="tab" aria-selected="false" aria-setsize="3"
                        aria-posinset="2" target="_self" href="#" class="nav-link" id="__BVID__3998___BV_tab_button__"
                        aria-controls="__BVID__3998" tabindex="-1">Profile</a></li>
                    <li role="presentation" class="nav-item"><a role="tab" aria-selected="false" aria-setsize="3"
                        aria-posinset="3" target="_self" href="#" class="nav-link" id="__BVID__4000___BV_tab_button__"
                        aria-controls="__BVID__4000" tabindex="-1">Contact</a></li>
                    <!---->
                  </ul>
                </div>
                <div class="tab-content" id="__BVID__3995__BV_tab_container_">
                  <div role="tabpanel" aria-hidden="false" class="tab-pane active" id="__BVID__3996"
                    aria-labelledby="__BVID__3996___BV_tab_button__" style="" tabindex="-1">
                    <p class="card-text">Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                      Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown
                      printer took a galley of type and scrambled it to make a type specimen book. It has survived not
                      only five centuries, but also the leap into electronic typesetting, remaining essentially
                      unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem
                      Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including
                      versions of Lorem Ipsum</p>
                  </div>
                  <div role="tabpanel" aria-hidden="true" class="tab-pane" id="__BVID__3998"
                    aria-labelledby="__BVID__3998___BV_tab_button__" style="display: none;">
                    <p class="card-text">Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                      Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown
                      printer took a galley of type and scrambled it to make a type specimen book. It has survived not
                      only five centuries, but also the leap into electronic typesetting, remaining essentially
                      unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem
                      Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including
                      versions of Lorem Ipsum</p>
                  </div>
                  <div role="tabpanel" aria-hidden="true" class="tab-pane" id="__BVID__4000"
                    aria-labelledby="__BVID__4000___BV_tab_button__" style="display: none;">
                    <p class="card-text">Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                      Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown
                      printer took a galley of type and scrambled it to make a type specimen book. It has survived not
                      only five centuries, but also the leap into electronic typesetting, remaining essentially
                      unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem
                      Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including
                      versions of Lorem Ipsum</p>
                  </div>
                  <!---->
                </div>
              </div>
            </div>
            <table class="table">
              <tr v-for="ad in ads" :key="ad.id">
                <td>
                  <input type="checkbox" class="checkbox_animated" v-model="selected_ads" :value="ad.id" />
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
          </div>
        </div>
      </div>
    </div>
    <!-- bm, ad account, campaign, adset, ad, 
        Container-fluid Ends-->
  </div>
</template>

<script>
  export default {
    data() {
      return {
        selected_ads: [],
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
        show_active_adaccounts: true,
        show_disabled_adaccounts: false,
        show_pixel: false,
        show_paymentmethod: false,
        access_tokens: {},
        access_token: ''
      }
    },
    methods: {
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
      getAdAccounts() {
        if (this.selected_bms.length) FB.api('/', {
          fields: 'client_ad_accounts.limit(1000){name,account_status,disable_reason,currency,adspixels{name},funding_source_details,timezone_id},owned_ad_accounts.limit(1000){name,account_status,disable_reason,currency,adspixels{name},funding_source_details,timezone_id}',
          ids: this.selected_bms.join(','),
          limit: 1000,
        }, res => {
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
        FB.api('/', {
          fields: 'ads.limit(1000){name,effective_status}',
          ids: this.selected_adaccounts.join(','),
          // summary: true,
          limit: 1000
        }, res => {
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
      }
    },
    computed: {
      _adaccounts: function () {
        return this.adaccounts.filter(a => (a.account_status === 1 && this.show_active_adaccounts) || (a
          .account_status > 1 && this.show_disabled_adaccounts))
      }
    }
  }
</script>