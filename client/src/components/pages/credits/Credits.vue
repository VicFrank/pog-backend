<template>
  <div class="main-layout__content">
    <div class="container">
      <div class="row">
        <div class="col-xl-12">
          <h1 class="page-title" v-t="'credits.page_title'"></h1>
          <div class="change-log">
            <ul>
              <i18n path="credits.sunsfan_credit" tag="li">
                <template v-slot:contact>
                  <a href="mailto:sunsfan@sunsfan.gg" target="_blank">{{ $t('credits.contact') }}</a>
                </template>
              </i18n>
              <li v-for="credit in $t('credits.credits')" :key="credit">{{credit}}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>