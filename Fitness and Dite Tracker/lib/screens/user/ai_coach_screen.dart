import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../config/dio_client.dart';
import '../../widgets/animated_icon_wrapper.dart';
import '../../config/theme.dart';

class AICoachScreen extends StatefulWidget {
  const AICoachScreen({super.key});

  @override
  State<AICoachScreen> createState() => _AICoachScreenState();
}

class _AICoachScreenState extends State<AICoachScreen> {
  final List<Map<String, String>> _messages = [
    {
      'role': 'ai',
      'text': 'Hello! I am your **Vitality AI Coach**. I can help you with diet plans, workout advice, or calculating your health metrics. How can I help you today?'
    }
  ];
  final _controller = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  bool _isTyping = false;

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

  Future<void> _sendMessage() async {
    final text = _controller.text.trim();
    if (text.isEmpty) return;

    setState(() {
      _messages.add({'role': 'user', 'text': text});
      _isTyping = true;
      _controller.clear();
    });
    _scrollToBottom();

    try {
      final dio = DioClient().dio;
      final response = await dio.post('/user/ai-coach/chat', data: {'message': text});
      
      if (response.statusCode == 200) {
        setState(() {
          _messages.add({'role': 'ai', 'text': response.data['reply']});
          _isTyping = false;
        });
      }
    } catch (e) {
      setState(() {
        _messages.add({'role': 'ai', 'text': "I'm sorry, I'm having trouble connecting right now. Please try again! 💪"});
        _isTyping = false;
      });
    }
    _scrollToBottom();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC),
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.transparent,
        title: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const AnimatedIconWrapper(
              child: Icon(Icons.auto_awesome_rounded, color: AppTheme.secondaryAmber, size: 24),
            ),
            const SizedBox(width: 12),
            Text("VitaAI Coach", style: GoogleFonts.outfit(fontWeight: FontWeight.w800, fontSize: 20)),
          ],
        ),
        centerTitle: true,
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.all(20),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final msg = _messages[index];
                final isAI = msg['role'] == 'ai';
                return _buildMessageBubble(msg['text']!, isAI, isDark).animate().fadeIn().slideY(begin: 0.1);
              },
            ),
          ),
          if (_isTyping)
            Padding(
              padding: const EdgeInsets.only(left: 24, bottom: 12),
              child: Row(
                children: [
                  SizedBox(
                    width: 40,
                    child: const LinearProgressIndicator(
                      backgroundColor: Colors.transparent,
                      valueColor: AlwaysStoppedAnimation<Color>(AppTheme.primaryEmerald),
                    ).animate().shimmer(),
                  ),
                  const SizedBox(width: 8),
                  Text("Coach is thinking...", style: GoogleFonts.outfit(fontSize: 12, color: Colors.grey, fontWeight: FontWeight.w600)),
                ],
              ),
            ),
          _buildInputArea(isDark),
        ],
      ),
    );
  }

  Widget _buildMessageBubble(String text, bool isAI, bool isDark) {
    final bgColor = isAI 
      ? (isDark ? Colors.white.withValues(alpha: 0.05) : Colors.white)
      : AppTheme.primaryEmerald;
    
    final textColor = isAI 
      ? (isDark ? Colors.white.withValues(alpha: 0.9) : Colors.black87)
      : Colors.white;

    return Align(
      alignment: isAI ? Alignment.centerLeft : Alignment.centerRight,
      child: Container(
        margin: const EdgeInsets.only(bottom: 20),
        constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.8),
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          color: bgColor,
          borderRadius: BorderRadius.only(
            topLeft: const Radius.circular(24),
            topRight: const Radius.circular(24),
            bottomLeft: Radius.circular(isAI ? 4 : 24),
            bottomRight: Radius.circular(isAI ? 24 : 4),
          ),
          boxShadow: [
            if (!isAI || !isDark)
              BoxShadow(
                color: isAI ? Colors.black.withValues(alpha: 0.05) : AppTheme.primaryEmerald.withValues(alpha: 0.2),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
          ],
        ),
        child: isAI 
          ? MarkdownBody(
              data: text,
              styleSheet: MarkdownStyleSheet(
                p: GoogleFonts.outfit(fontSize: 15, color: textColor, height: 1.5, fontWeight: FontWeight.w400),
                strong: GoogleFonts.outfit(fontWeight: FontWeight.w700, color: isDark ? AppTheme.secondaryAmber : AppTheme.primaryEmerald),
                listBullet: GoogleFonts.outfit(color: AppTheme.secondaryAmber),
              ),
            )
          : Text(
              text,
              style: GoogleFonts.outfit(fontSize: 15, color: textColor, fontWeight: FontWeight.w500),
            ),
      ),
    );
  }

  Widget _buildInputArea(bool isDark) {
    return Container(
      padding: EdgeInsets.fromLTRB(20, 20, 20, MediaQuery.of(context).padding.bottom + 20),
      decoration: BoxDecoration(
        color: isDark ? AppTheme.surfaceDark : Colors.white,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(32)),
        boxShadow: [
          BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 20, offset: const Offset(0, -5)),
        ],
      ),
      child: Row(
        children: [
          Expanded(
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              decoration: BoxDecoration(
                color: isDark ? Colors.white.withValues(alpha: 0.05) : Colors.grey.withValues(alpha: 0.05),
                borderRadius: BorderRadius.circular(20),
              ),
              child: TextField(
                controller: _controller,
                maxLines: null,
                style: GoogleFonts.outfit(fontSize: 15),
                decoration: InputDecoration(
                  hintText: "Ask your coach...",
                  hintStyle: GoogleFonts.outfit(color: Colors.grey),
                  border: InputBorder.none,
                ),
              ),
            ),
          ),
          const SizedBox(width: 12),
          GestureDetector(
            onTap: _sendMessage,
            child: Container(
              padding: const EdgeInsets.all(14),
              decoration: const BoxDecoration(
                color: AppTheme.primaryEmerald,
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.send_rounded, color: Colors.white, size: 22),
            ),
          ),
        ],
      ),
    );
  }
}
