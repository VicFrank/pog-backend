<template>
  <div class="main-layout__content">
    <div class="container">
      <h1 class="page-title" v-t="'faq.page_title'"></h1>
      <div class="question" v-t="'faq.question1'"></div>
      <div class="answer" v-t="'faq.answer1'"></div>
      <div class="question" v-t="'faq.question13'"></div>
      <div class="answer" v-t="'faq.answer13'"></div>
      <div class="question" v-t="'faq.question2'"></div>
      <div class="answer">
        {{$t('faq.answer2')}}
        <ul>
          <li>
            {{$t('faq.answer2-1')}}
            <ul>
              <li>{{$t('faq.answer2-2')}}</li>
              <li>{{$t('faq.answer2-3')}}</li>
              <li>{{$t('faq.answer2-4')}}</li>
              <li>{{$t('faq.answer2-5')}}</li>
            </ul>
          </li>
          <li>
            {{$t('faq.answer2-6')}}
            <ul>
              <li>{{$t('faq.answer2-7')}}</li>
              <li>{{$t('faq.answer2-8')}}</li>
              <li>{{$t('faq.answer2-9')}}</li>
            </ul>
          </li>
          <li>
            {{$t('faq.answer2-10')}}
            <ul>
              <li>{{$t('faq.answer2-11')}}</li>
              <li>{{$t('faq.answer2-12')}}</li>
              <li>{{$t('faq.answer2-13')}}</li>
              <li>{{$t('faq.answer2-14')}}</li>
            </ul>
          </li>
        </ul>
      </div>
      <div class="question" v-t="'faq.question3'"></div>
      <i18n path="faq.answer3" tag="div" class="answer">
        <template v-slot:here>
          <a
            href="https://www.pathofguardians.com/guardians"
            target="_blank"
          >{{ $t('faq.answer3-link') }}</a>
        </template>
      </i18n>
      <div class="question" v-t="'faq.question4'"></div>
      <i18n path="faq.answer4" tag="div" class="answer">
        <template v-slot:link>
          <a
            href="https://www.pathofguardians.com/store"
            target="_blank"
          >{{ $t('faq.answer4-link') }}</a>
        </template>
      </i18n>
      <!-- <div class="question" v-t="'faq.question5'"></div>
      <div class="answer" v-t="'faq.answer5'"></div>-->
      <div class="question" v-t="'faq.question6'"></div>
      <div class="answer" v-t="'faq.answer6'"></div>
      <div class="question" v-t="'faq.question7'"></div>
      <div class="answer" v-t="'faq.answer7'"></div>
      <div class="question" v-t="'faq.question8'"></div>
      <i18n path="faq.answer8" tag="div" class="answer">
        <template v-slot:link>
          <a href="http://discord.gg/sunsfan" target="_blank">{{ $t('faq.answer8-link') }}</a>
        </template>
      </i18n>
      <div class="question" v-t="'faq.question9'"></div>
      <div class="answer" v-t="'faq.answer9'"></div>
      <div class="question" v-t="'faq.question10'"></div>
      <i18n path="faq.answer10" tag="div" class="answer">
        <template v-slot:link>
          <a
            href="https://www.reddit.com/r/DotaCinema/"
            target="_blank"
          >{{ $t('faq.answer10-link') }}</a>
        </template>
      </i18n>
      <div class="question" v-t="'faq.question11'"></div>
      <div class="answer" v-t="'faq.answer11'"></div>
      <div class="question" v-t="'faq.question12'"></div>
      <div class="answer" v-t="'faq.answer12'"></div>
      <div class="question" v-t="'faq.question14'"></div>
      <div class="answer" v-t="'faq.answer14'"></div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
.question {
  color: #0b86c4;
  font-size: 2rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
  line-height: 1.2;
}

.answer {
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
  line-height: 1.2;
}
</style>
