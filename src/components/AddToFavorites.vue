<template>
  <button
    @click="handleLike"
    :class="{
      btn: true,
      'btn-sm': true,
      'btn-primary': isFavoriteOptimistic,
      'btn-outline-primary': !isFavoriteOptimistic,
    }"
  >
    <i class="ion-heart" /><span>&nbsp; {{ favoritesCountOptimistic }}</span>
  </button>
</template>

<script>
import { actionTypes } from "@/store/modules/addToFavorites";

export default {
  name: "McvAddToFavorites",
  props: {
    isFavorited: {
      type: Boolean,
      required: true,
    },
    articleSlug: {
      type: String,
      required: true,
    },
    favoritesCount: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      isFavoriteOptimistic: this.isFavorited,
      favoritesCountOptimistic: this.favoritesCount,
    };
  },
  methods: {
    handleLike() {
      this.$store.dispatch(actionTypes.addToFavorites, {
        slug: this.articleSlug,
        isFavorited: this.isFavoriteOptimistic,
      });
      if (this.isFavoriteOptimistic) {
        this.favoritesCountOptimistic = this.favoritesCountOptimistic - 1;
      } else {
        this.favoritesCountOptimistic = this.favoritesCountOptimistic + 1;
      }
      this.isFavoriteOptimistic = !this.isFavoriteOptimistic;
    },
  },
};
</script>
