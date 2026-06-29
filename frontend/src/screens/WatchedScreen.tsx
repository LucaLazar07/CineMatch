import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FilmStripCard from "../components/FilmStripCard";
import {
  getWatchedList,
  getMovieDetails,
  getNote,
  saveNote,
  type MovieDetail,
} from "../services/api";
import { layoutStyles } from "../theme/layoutStyles";
import { tokens } from "../theme/tokens";

type Entry = { movie: MovieDetail; watchedOn: string };

export default function WatchedScreen(): React.ReactElement {
  const insets = useSafeAreaInsets();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalId, setModalId] = useState<number | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { items } = await getWatchedList();
      const loaded: Entry[] = [];
      for (const w of items) {
        const m = await getMovieDetails(w.movie_id).catch(() => null);
        if (m) {
          loaded.push({ movie: m, watchedOn: w.watched_at.slice(0, 10) });
        }
      }
      setEntries(loaded);
    } catch {
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const openNote = async (m: MovieDetail) => {
    setModalId(m.id);
    setModalTitle(m.title);
    try {
      const { note } = await getNote(m.id);
      setNoteDraft(note);
    } catch {
      setNoteDraft("");
    }
  };

  const closeModal = () => {
    setModalId(null);
    setNoteDraft("");
    setModalTitle("");
  };

  const onSaveNote = async () => {
    if (modalId == null) return;
    try {
      await saveNote(modalId, noteDraft);
    } catch {
      // ignore
    }
    closeModal();
  };

  const empty = !loading && entries.length === 0;

  return (
    <View style={layoutStyles.screen}>
      <View style={layoutStyles.grainOverlay} />
      <Text style={[styles.header, { marginTop: insets.top + 16 }]}>
        Seen
      </Text>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={tokens.colors.primaryRed} />
        </View>
      ) : null}
      {empty ? (
        <View style={styles.emptyWrap}>
          <View style={styles.filmStripEmpty}>
            <View style={styles.emptyFrame} />
            <View style={styles.emptyFrame} />
            <View style={styles.emptyFrame} />
          </View>
          <Text style={styles.emptyText}>Your reel is empty.</Text>
        </View>
      ) : null}
      {!loading && entries.length > 0 ? (
        <ScrollView
          contentContainerStyle={layoutStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {entries.map(({ movie, watchedOn }) => (
            <FilmStripCard
              key={String(movie.id)}
              movie={movie}
              watchedOnLabel={`Watched on ${watchedOn}`}
              onPress={() => openNote(movie)}
            />
          ))}
        </ScrollView>
      ) : null}

      <Modal
        visible={modalId != null}
        animationType="slide"
        transparent
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { paddingBottom: insets.bottom + 16 }]}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <Text style={styles.modalPrompt}>What did you think?</Text>
            <TextInput
              style={styles.noteInput}
              value={noteDraft}
              onChangeText={setNoteDraft}
              placeholder="Your thoughts…"
              placeholderTextColor={tokens.colors.textSecondary}
              multiline
            />
            <Pressable onPress={onSaveNote} style={styles.saveNoteBtn}>
              <Text style={styles.saveNoteText}>Save note</Text>
            </Pressable>
            <Pressable onPress={closeModal} style={styles.dismissBtn}>
              <Text style={styles.dismissText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontFamily: tokens.fonts.playfairItalic,
    fontSize: tokens.fontSize.profileHeader,
    color: tokens.colors.ink,
    marginHorizontal: tokens.spacing.screenHorizontal,
    marginBottom: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: tokens.spacing.screenHorizontal,
  },
  filmStripEmpty: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyFrame: {
    width: 56,
    height: 56,
    borderWidth: 1,
    borderColor: tokens.colors.divider,
    backgroundColor: tokens.colors.filmFrameEmpty,
    marginHorizontal: 4,
  },
  emptyText: {
    fontFamily: tokens.fonts.playfairItalic,
    fontSize: tokens.fontSize.body,
    color: tokens.colors.textSecondary,
    textAlign: "center",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: tokens.colors.modalScrim,
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: tokens.colors.bg,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingHorizontal: tokens.spacing.screenHorizontal,
    paddingTop: 20,
  },
  modalTitle: {
    fontFamily: tokens.fonts.playfairBold,
    fontSize: 22,
    color: tokens.colors.ink,
    marginBottom: 8,
  },
  modalPrompt: {
    fontFamily: tokens.fonts.playfairItalic,
    fontSize: tokens.fontSize.body,
    color: tokens.colors.textSecondary,
    marginBottom: 12,
  },
  noteInput: {
    fontFamily: tokens.fonts.dmRegular,
    fontSize: tokens.fontSize.body,
    color: tokens.colors.ink,
    borderWidth: 1,
    borderColor: tokens.colors.divider,
    minHeight: 100,
    padding: 12,
    textAlignVertical: "top",
    marginBottom: 16,
  },
  saveNoteBtn: {
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  saveNoteText: {
    fontFamily: tokens.fonts.dmBold,
    fontSize: tokens.fontSize.body,
    color: tokens.colors.primaryRed,
  },
  dismissBtn: {
    alignSelf: "flex-start",
  },
  dismissText: {
    fontFamily: tokens.fonts.dmRegular,
    fontSize: tokens.fontSize.meta,
    color: tokens.colors.textSecondary,
  },
});
