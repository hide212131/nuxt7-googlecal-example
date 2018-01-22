<template>
  <f7-page>
    <f7-navbar title="Error" back-link="Back"></f7-navbar>
    <f7-block-title>エラーが発生しました。</f7-block-title>
    <f7-block strong>
        {{ JSON.stringify(this.$store.state) }}
    </f7-block>
  </f7-page>
</template>

<script>
export default {

}
</script>
