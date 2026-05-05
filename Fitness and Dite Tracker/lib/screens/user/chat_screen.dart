import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../../providers/auth_provider.dart';
import '../../providers/chat_provider.dart';
import '../../config/theme.dart';

class ChatScreen extends ConsumerStatefulWidget {
  const ChatScreen({super.key});

  @override
  ConsumerState<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends ConsumerState<ChatScreen> {
  final TextEditingController _msgController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  Timer? _pollTimer;
  String? _adminId;

  @override
  void initState() {
    super.initState();
    _initChat();
  }

  @override
  void dispose() {
    _pollTimer?.cancel();
    _msgController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  Future<void> _initChat() async {
    final id = await ref.read(chatProvider.notifier).fetchSupportAdmin();
    if (id != null) {
      _adminId = id;
      await ref.read(chatProvider.notifier).fetchMessages(id);
      _scrollToBottom();
      // Start polling every 3 seconds for new messages
      _pollTimer = Timer.periodic(const Duration(seconds: 3), (_) async {
        if (_adminId != null && mounted) {
          await ref.read(chatProvider.notifier).fetchMessages(_adminId!);
        }
      });
    }
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final chatState = ref.watch(chatProvider);
    final user = ref.watch(authProvider).user;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: Column(
          children: [
            Text("Support Comms", style: GoogleFonts.outfit(fontWeight: FontWeight.w800, fontSize: 18)),
            Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 8, height: 8,
                  decoration: const BoxDecoration(color: Colors.green, shape: BoxShape.circle),
                ),
                const SizedBox(width: 6),
                Text("Live Support", style: GoogleFonts.outfit(fontSize: 10, color: AppTheme.primaryEmerald, fontWeight: FontWeight.w800, letterSpacing: 0.5)),
              ],
            ),
          ],
        ),
        centerTitle: true,
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: Column(
        children: [
          Expanded(
            child: chatState.isLoading && chatState.messages.isEmpty
              ? const Center(child: CircularProgressIndicator())
              : chatState.messages.isEmpty
                  ? _buildEmptyChat(isDark)
                  : ListView.builder(
                      controller: _scrollController,
                      padding: const EdgeInsets.all(20),
                      itemCount: chatState.messages.length,
                      itemBuilder: (context, index) {
                        final msg = chatState.messages[index];
                        final isMe = msg.senderId == user?.id;
                        return _buildMessageBubble(msg, isMe, isDark);
                      },
                    ),
          ),
          _buildInputArea(isDark, chatState.isSending),
        ],
      ),
    );
  }

  Widget _buildEmptyChat(bool isDark) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: AppTheme.primaryEmerald.withValues(alpha: 0.1),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.forum_outlined, size: 40, color: AppTheme.primaryEmerald),
          ),
          const SizedBox(height: 20),
          Text(
            "Secure Channel Established",
            style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.w800),
          ),
          const SizedBox(height: 8),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 40),
            child: Text(
              "How can we help you reach your goals today?",
              textAlign: TextAlign.center,
              style: GoogleFonts.outfit(fontSize: 13, color: isDark ? Colors.white38 : Colors.black38),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMessageBubble(ChatMessage msg, bool isMe, bool isDark) {
    return Align(
      alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.75),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: isMe 
            ? AppTheme.primaryEmerald 
            : (isDark ? Colors.white.withValues(alpha: 0.08) : Colors.white),
          borderRadius: BorderRadius.only(
            topLeft: const Radius.circular(20),
            topRight: const Radius.circular(20),
            bottomLeft: Radius.circular(isMe ? 20 : 0),
            bottomRight: Radius.circular(isMe ? 0 : 20),
          ),
          boxShadow: [
            if (!isMe)
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.05),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
          ],
        ),
        child: Column(
          crossAxisAlignment: isMe ? CrossAxisAlignment.end : CrossAxisAlignment.start,
          children: [
            Text(
              msg.message,
              style: GoogleFonts.outfit(
                fontSize: 13,
                color: isMe ? Colors.white : (isDark ? Colors.white : Colors.black87),
                fontWeight: FontWeight.w500,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              DateFormat('hh:mm a').format(msg.createdAt),
              style: GoogleFonts.outfit(
                fontSize: 9,
                color: isMe ? Colors.white70 : (isDark ? Colors.white38 : Colors.black38),
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInputArea(bool isDark, bool isSending) {
    return Container(
      padding: const EdgeInsets.fromLTRB(20, 10, 20, 30),
      decoration: BoxDecoration(
        color: isDark ? AppTheme.bgDark : AppTheme.bgLight,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 20,
            offset: const Offset(0, -5),
          ),
        ],
      ),
      child: Row(
        children: [
          Expanded(
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              decoration: BoxDecoration(
                color: isDark ? Colors.white.withValues(alpha: 0.05) : Colors.black.withValues(alpha: 0.03),
                borderRadius: BorderRadius.circular(25),
              ),
              child: TextField(
                controller: _msgController,
                style: GoogleFonts.poppins(fontSize: 14),
                decoration: InputDecoration(
                  hintText: "Type your message...",
                  hintStyle: GoogleFonts.poppins(fontSize: 13, color: Colors.grey),
                  border: InputBorder.none,
                ),
                onSubmitted: (_) => _sendMessage(),
              ),
            ),
          ),
          const SizedBox(width: 12),
          GestureDetector(
            onTap: isSending ? null : _sendMessage,
            child: Container(
              width: 50,
              height: 50,
              decoration: const BoxDecoration(
                color: AppTheme.primaryEmerald,
                shape: BoxShape.circle,
              ),
              child: isSending 
                ? const Padding(padding: EdgeInsets.all(12), child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                : const Icon(Icons.send_rounded, color: Colors.white, size: 24),
            ),
          ),
        ],
      ),
    );
  }

  void _sendMessage() async {
    final msg = _msgController.text.trim();
    if (msg.isEmpty) return;

    _msgController.clear();
    bool success = await ref.read(chatProvider.notifier).sendToSupport(msg);
    if (success && mounted) {
      _scrollToBottom();
    }
  }
}
