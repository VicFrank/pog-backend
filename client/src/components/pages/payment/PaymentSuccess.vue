<template>
  <div class="main-layout__content">
    <div class="content">
      <div class="container text-center">
        <h1 class="blue" v-t="'payment.payment_success'"></h1>
        <h6 v-t="'payment.success_1'"></h6>
        <i18n path="payment.success_2" tag="h6">
          <template v-slot:contact_us>
            <a
              href="https://www.reddit.com/message/compose?to=dcneil&subject=&message="
              target="_blank"
            >{{ $t('home.row8-link2') }}</a>
          </template>
        </i18n>
        <b-button to="poggers" variant="primary" class="mt-3">{{$t('payment.back_to_store')}}</b-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style></style>
