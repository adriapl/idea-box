<template>
  <div class="container mx-auto p-4">
    <div class="w-full bg-gray-100 shadow-lg p-4 rounded-lg">
      <h1 class="mb-5 text-4xl text-center">IdeaBox</h1>
      <AddIdea
        :user="user"
        @do-login="doLogin"
        @do-logout="doLogout"
        @add-idea="addIdea"
      />
      <AppIdea
        v-for="(idea, $index) in ideas"
        :key="$index"
        :idea="idea"
        @vote-idea="voteIdea"
      />
    </div>
  </div>
</template>

<script>
import AppIdea from "./components/AppIdea";
import AddIdea from "./components/AddIdea";
import { ref } from "vue";
import { auth, firebase, db } from "@/firebase.js";
export default {
  name: "App",
  setup() {
    const ideas = ref([]);

    let user = ref(null);
    auth.onAuthStateChanged(async (auth) => (user.value = auth ? auth : null));

    db.collection("ideas")
      .orderBy("votes", "desc")
      .onSnapshot((snapshot) => {
        const newIdeas = [];
        snapshot.docs.forEach(
          (doc) => {
            const { name, user, userName, votes } = doc.data();
            let id = doc.id;
            newIdeas.push({
              name,
              user,
              userName,
              votes,
              id
            });
            ideas.value = newIdeas;
          },
          (error) => console.error(error)
        );
      });

    const doLogin = async () => {
      const provider = new firebase.auth.GoogleAuthProvider();

      try {
        await auth.signInWithPopup(provider);
      } catch (error) {
        console.error(error);
      }
    };

    const doLogout = async () => {
      try {
        await auth.signOut();
      } catch (error) {
        console.error(error);
      }
    };

    const addIdea = async (data) => {
      try {
        await db.collection("ideas").add({
          name: data.value,
          user: user.value.uid,
          userName: user.value.displayName,
          votes: 0
        });
      } catch (error) {
        console.error(error);
      }
    };

    const voteIdea = async ({ id, type }) => {
      try {
        db.collection("ideas")
          .doc(id)
          .update({
            votes: firebase.firestore.FieldValue.increment(type ? 1 : -1)
          });
      } catch (error) {
        console.error(error);
      }
    };

    return { ideas, user, doLogin, doLogout, addIdea, voteIdea };
  },
  components: {
    AppIdea,
    AddIdea
  }
};
</script>

<!-- If I remove the lang="postcss" an error appears "semi-colon expectedcss(css-semicolonexpected)" -->
<style lang="postcss">
.user-actions {
  @apply mt-2 text-center;
}

.user-actions a {
  font-weight: bold;
  text-decoration: underline;
}
</style>
